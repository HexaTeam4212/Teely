from peewee import *
from init_database import PERSON, PARTICIPATE_IN, TASK, GROUP, INVITATION, DEPENDANCE
import datetime
import math

def order_tasks(group):
	print("order start")

	#daily limits
	dayStart = datetime.time(8,0)
	dayEnd = datetime.time(17,0)

	#get all tasks to schedule
	all_tasks = TASK.select().where(TASK.Group == group & TASK.DatetimeEnd == None)
	
	#get all tasks with no dependencies or with past dependencies
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

	print(all_t)
	print(no_dep_task)

	# get current date to have a starting point for the algorithm
	date_algo = datetime.datetime.now()

	# if current hour is too early for the day
	if date_algo.hour < dayStart.hour:
		date_algo = date_algo.replace(hour=dayStart.hour, minute=dayStart.minute, second=0, microsecond=0)

	# if current hour is too late for the day
	if date_algo.hour >= dayEnd.hour:
		date_algo = date_algo.replace(hour=dayStart.hour, minute=dayStart.minute, second=0, microsecond=0)
		date_algo = date_algo + datetime.timedelta(days=1)

	print(date_algo)

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
			for user in group_users:
				task_count = TASK.select().where(TASK.TaskUser == user).count()
				if task_count < less_task_count:
					less_task_count = task_count
					selected_user = user

			shortest_task.TaskUser = selected_user
			shortest_task.save()

		# find a spot for the task in the schedule



		# add all task that has a dependency with the one we just treated


		# remove the treated task from the no_dep_task list
		no_dep_task.remove(shortest_task)

		print(no_dep_task)
		return