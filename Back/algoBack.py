from peewee import *
from init_database import PERSON, PARTICIPATE_IN, TASK, GROUP, INVITATION, DEPENDANCE
import datetime
import math

def give_task_info(task):

	dependenciesIds = []
	dependencies = DEPENDANCE.select().where(DEPENDANCE.TaskConcerned == task)
	for dep in dependencies:
		dependenciesIds.append(dep.TaskDependency.taskId)

	return {
        "taskId": task.taskId,
        "name": task.Name,
        "description": task.Description,
        "taskUser": task.TaskUser.Username,
        "frequency": task.Frequency,
        "priority": task.PriorityLevel,
        "datetimeStart" : task.DatetimeStart,
        "datetimeEnd": task.DatetimeEnd,
        "dependencies" : dependenciesIds,
        "duration" : task.Duration
    }



def order_tasks(group, startHour, startMinute, endHour, endMinute):
	tasks_modified = []

	#daily limits
	dayStart = datetime.datetime(year=1900, month=1, day=1, hour=int(startHour), minute=int(startMinute))
	dayEnd = datetime.datetime(year=1900, month=1, day=1, hour=int(endHour), minute=int(endMinute))
	diff = dayEnd - dayStart

	# first get all task which have dates but no user assigned and give them a user
	task_needing_user = TASK.select().where(TASK.TaskUser.is_null(), TASK.DatetimeStart.is_null(False), TASK.DatetimeEnd.is_null(False))
	
	for task in task_needing_user:
		group_users = PARTICIPATE_IN.select().where(PARTICIPATE_IN.Group == group)
		less_task_count = math.inf
		selected_user = None

		for user_part in group_users:
			task_count = TASK.select().where(TASK.Group == group, TASK.TaskUser == user_part.User).count()

			# [] = TASK et () = task
			task_overlap = TASK.select().where( (TASK.taskId != task.taskId) & (TASK.TaskUser == user_part.User) & (
				((TASK.DatetimeStart < task.DatetimeStart) & (TASK.DatetimeEnd > task.DatetimeStart)) # [ ( ] ) or [ ( ) ]
				| ((TASK.DatetimeStart < task.DatetimeEnd) & (TASK.DatetimeEnd > task.DatetimeEnd)) # ( [ ) ] or [ ( ) ]
				| ((TASK.DatetimeStart > task.DatetimeStart) & (TASK.DatetimeEnd < task.DatetimeEnd)) # ( [ ] )
			))
			
			if task_count < less_task_count and len(task_overlap) == 0:
				less_task_count = task_count
				selected_user = user_part.User

		# if no user can be found for the task, the task must be re-schedule
		if selected_user is None:
			task.DatetimeStart = None
			task.DatetimeEnd = None
			task.save()
		else:
			task.TaskUser = selected_user
			task.save()
			tasks_modified.append(give_task_info(task))

	# get all tasks to schedule
	all_tasks = TASK.select().where(TASK.Group == group, TASK.DatetimeEnd.is_null())
	
	# check if all tasks can be processed
	for task in all_tasks:
		if task.Duration > diff.seconds/60:
			raise Exception("task duration too big")

	# get all tasks with no dependencies or with past dependencies
	all_t = []
	no_dep_task = []
	for task in all_tasks:
		all_t.append(task)
		task_dep = DEPENDANCE.select().where(DEPENDANCE.TaskConcerned == task)
		if len(task_dep) > 0:
			for dep in task_dep:
				if dep.TaskDependency.DatetimeStart is not None and dep.TaskDependency.DatetimeEnd is not None:
					no_dep_task.append(task)
		else:
			no_dep_task.append(task)

	# get current date to have a starting point for the algorithm
	date_algo = datetime.datetime.now()
	date_algo = date_algo.replace(second=0, microsecond=0) + datetime.timedelta(minutes=1)

	# if current hour is too early for the day
	if date_algo.hour < dayStart.hour:
		date_algo = date_algo.replace(hour=dayStart.hour, minute=dayStart.minute)

	# if current hour is too late for the day
	if date_algo.hour >= dayEnd.hour:
		date_algo = date_algo.replace(hour=dayStart.hour, minute=dayStart.minute)
		date_algo = date_algo + datetime.timedelta(days=1)

	while len(no_dep_task) > 0:
		# determine which task is the shortest
		shortest_time = math.inf
		for task in no_dep_task:
			if task.Duration < shortest_time:
				shortest_time = task.Duration
				shortest_task = task
		
		# give a user to the task if this task doesn't have one
		# we select the user with the least number of task given
		# in case of two user have the same amount, the first one checked will be selected
		if shortest_task.TaskUser is None:
			group_users = PARTICIPATE_IN.select().where(PARTICIPATE_IN.Group == group)
			less_task_count = math.inf
			for user_participate in group_users:
				task_count = TASK.select().where(TASK.Group == group, TASK.TaskUser == user_participate.User).count()

				if task_count < less_task_count:
					less_task_count = task_count
					selected_user = user_participate.User

			shortest_task.TaskUser = selected_user
			shortest_task.save()

		# find a spot for the task in the schedule
		# first check for dependency
		shortest_task_dep = DEPENDANCE.select().where(DEPENDANCE.TaskConcerned == shortest_task)
		latter_date = date_algo
		if len(shortest_task_dep) > 0:
			for dep in shortest_task_dep:
				if dep.TaskDependency.DatetimeEnd > latter_date:
					latter_date = dep.TaskDependency.DatetimeEnd

		# The task must start at or after latter date because we need other tasks to be finished
		
		task_end_time = latter_date + datetime.timedelta(minutes=shortest_task.Duration)

		# get all task of selected_user after latter_date
		spot_found = False
		while spot_found == False:
			# Check if there is enough time this day to do the task
			if task_end_time.hour >= dayEnd.hour:
				# proceed to next day
				latter_date = latter_date.replace(hour=dayStart.hour, minute=dayStart.minute, second=0) + datetime.timedelta(days=1)
				task_end_time = latter_date + datetime.timedelta(minutes=shortest_task.Duration)

			all_next_tasks = TASK.select().where(TASK.DatetimeStart >= latter_date, TASK.TaskUser == shortest_task.TaskUser)
			spot_found = True
			for task in all_next_tasks:
				# if a task start before task_end_time, spot is too short
				if task.DatetimeStart < task_end_time:
					spot_found = False
					# update latter_date and task_end_time
					latter_date = task.DatetimeEnd + datetime.timedelta(minutes=1)
					task_end_time = latter_date + datetime.timedelta(minutes=shortest_task.Duration)
					break
			
		# Set the date for our shortest_task
		shortest_task.DatetimeStart = latter_date
		shortest_task.DatetimeEnd = task_end_time
		shortest_task.save()
		tasks_modified.append(give_task_info(shortest_task))

		# add all task that has a dependency with the one we just treated
		task_whit_shortest_task_as_dep = DEPENDANCE.select().where(DEPENDANCE.TaskDependency == shortest_task)
		for dep in task_whit_shortest_task_as_dep:
			no_dep_task.append(dep.TaskConcerned)

		# remove the treated task from the no_dep_task list
		no_dep_task.remove(shortest_task)

	return { "tasks_modified": tasks_modified }