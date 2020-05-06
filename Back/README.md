# Teely

## Backend

Backend server for the Teely application made using the Flask Framework for Python.  
The Python version used is 3.8.2

## Usage

To be able to properly run the server, there are a few steps to do:  
  
First install a MySQL server, we recommend the use of MySQL Workbench to deal with the database.  
Create the schema that will hold the database in MySQL Workbench.  
Once created, edit the `config.ini` file with your database name and change the user and password. If you run the server on a remote machine, change the host and port values.  
  
Make sure you have all python dependencies installed. You can run the following command to install them :  
```pip install -r requirements.txt```  
Now, you can initialize the database by running the `init_database.py` script. Simply run :  
```python init_database.py```  

You are ready to launch the server. To start it, use the following command :  
```python -m flask run```  

You will get a message telling you on which port the server has started.
