import pymysql

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='Dodo@123',
    database='warehouse'
)

zones = [chr(z) for z in range(ord('A'), ord('J')+1)]
with connection.cursor() as cursor:
    for zone in zones:
        for shelf in range(1, 11):
            for rack in range(1, 21):
                cursor.execute(
                    "INSERT INTO rack_capacity (zone, shelf, rack, used_weight) VALUES (%s, %s, %s, 0)",
                    (zone, shelf, rack)
                )
connection.commit()
connection.close()