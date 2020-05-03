from peewee import *

mysql_db = MySQLDatabase('teely_db', user='root', password='root', host='127.0.0.1', port=3306)

class BaseModel(Model):
    """A base model that will use our MySQL database"""
    class Meta:
        database = mysql_db

class PERSON(BaseModel):
	personId = AutoField(primary_key = True)
	Username = CharField(max_length = 30, unique = True)
	Email = CharField(max_length = 50, unique = True)
	Password = CharField(max_length = 50)
	LastName = CharField(max_length = 50)
	Name = CharField(max_length = 50)
	BirthDate = DateField(formats = '%Y-%m-%d')
	Bio = CharField(max_length = 500, null = True)
	idImage = IntegerField(null = True)

class GROUP(BaseModel):
	groupId = AutoField(primary_key = True)
	Name = CharField(max_length = 50)
	Description = CharField(max_length = 500)
	idImage = IntegerField(null = True)

class PARTICIPATE_IN(BaseModel):
    User = ForeignKeyField(PERSON, backref='+')
    Group = ForeignKeyField(GROUP, backref='+')

class TASK(BaseModel):
    taskId = AutoField(primary_key = True)
    TaskUser = ForeignKeyField(PERSON, backref='+', null = True)
    Name = CharField(max_length = 50, null = True)
    Description = CharField(max_length = 500, null = True)
    Frequency = IntegerField(null = True)
    Group = ForeignKeyField(GROUP, backref='+')
    DatetimeStart = DateTimeField(formats = '%Y-%m-%d %H:%M:%S', null = True)
    DatetimeEnd = DateTimeField(formats = '%Y-%m-%d %H:%M:%S', null = True)
    PriorityLevel = IntegerField(null = True)

class DEPENDANCE(BaseModel):
    DependanceId = AutoField(primary_key = True)
    TaskConcerned = ForeignKeyField(TASK, backref='+')
    TaskDependency = ForeignKeyField(TASK, backref='+')

class INVITATION(BaseModel):
	invitationId = AutoField(primary_key = True)
	Sender = ForeignKeyField(PERSON, backref='+')
	Recipient = ForeignKeyField(PERSON, backref='+')
	Group = ForeignKeyField(GROUP, backref='+')

mysql_db.connect()

mysql_db.create_tables([PERSON, GROUP, PARTICIPATE_IN, TASK, INVITATION, DEPENDANCE])
