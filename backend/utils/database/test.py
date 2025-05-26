import psycopg2 as pg2

conn = pg2.connect(database= , user=, password=)

cur = conn.cursor()

cur.execute('SELECT * FROM payment')

cur.fetchone()

cur.fetchmany(10)

conn.close