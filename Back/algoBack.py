from peewee import *
from init_database import PERSON, PARTICIPATE_IN, TASK, GROUP, INVITATION, DEPENDANCE
import datetime


def order_tasks(group):
	print("order start")

	#daily limits
	dayStart = datetime.time(8,0,0)
	dayEnd = datetime.time(17,0,0)

	#get all tasks to schedule
	all_tasks = TASK.select().where(TASK.Group == group & TASK.DatetimeEnd == None)
	
	#get all tasks with no dependencies or with past dependencies
	no_dep_task = []
	for task in all_tasks:
		task_dep = DEPENDANCE.select().where(DEPENDANCE.TaskConcerned == task)
		if len(task_dep) > 0:
			for dep in task_dep:
				if dep.DatetimeStart is not None and dep.DatetimeEnd is not None:
					no_dep_task.append(task)
		else:
			no_dep_task.append(task)