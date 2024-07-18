import requests as rq
import json

timezones = rq.get("http://worldtimeapi.org/api/timezone").json()

with open("timezones.json", "w") as file:
    file.write("[")
    file.write(",".join([f"\"{tz}\"" for tz in timezones]))
    file.write("]")