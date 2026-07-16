from flask import Flask
from flask import Flask, render_template, request, jsonify
from datetime import datetime
from geopy.distance import geodesic
import pickle
import os
import requests


app = Flask(__name__,template_folder=".",static_url_path="/static")
@app.route("/")
def love():
    return render_template('index.html',fare=0.00)

def fare_amount(data):
    with open('fare_price.pickle','rb') as f:
        fare_model = pickle.load(f)
    price = round(fare_model.predict(data)[0],2)
    return price 

def calculate_distance(pickup_lat,
                      pickup_long,
                      dropoff_lat,
                      dropoff_long):
    return geodesic((pickup_lat, pickup_long),
                     (dropoff_lat, dropoff_long)).miles





def get_lat_long(location):
    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": location,
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "my-app"
    }

    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()

        if data:
            print("Latitude :", data[0]["lat"])
            print("Longitude:", data[0]["lon"])
            return float(data[0]["lat"]), float(data[0]["lon"])
        else:
            return "Location not found"
    else:
        return f"Error: {response.status_code}"


@app.route('/predict',methods = ['POST'])
def predict():
    if request.method == 'POST':
        # User input location name
        pickup_location = request.form['pickup']
        drop_location = request.form['drop']
        pickup_datetime = request.form['pickup_datetime']
        passenger_count = int(request.form['passenger_count'])

        
        # Get latitude longitude using your function
        pickup_latitude, pickup_longitude = get_lat_long(pickup_location)

        dropoff_latitude, dropoff_longitude = get_lat_long(drop_location)
        
        # Convert datetime
        pickup_datetime = datetime.strptime(
            pickup_datetime,
            '%Y-%m-%dT%H:%M'
        )
        year = pickup_datetime.year
        month = pickup_datetime.month
        day = pickup_datetime.day
        hour = pickup_datetime.hour
        minute = pickup_datetime.minute
        second = pickup_datetime.second
        # Calculate distance
        distance = calculate_distance(
            pickup_longitude,
            pickup_latitude,
            dropoff_longitude,
            dropoff_latitude
        )
        # Model input
        X = [[
            pickup_longitude,
            pickup_latitude,
            dropoff_longitude,
            dropoff_latitude,
            passenger_count,
            distance,
            year,
            month,
            day,
            hour,
            minute,
            second
        ]]
        fare = round(fare_amount(X) * passenger_count)
        return render_template(
            'index.html',
            fare=f"${fare}"
        )
    return render_template(
        'index.html',
        fare="$0.00"
    )


# @app.route('/predict',methods = ['POST'])
# def predict():
#     if request.method == 'POST':
#         pickup_datetime = request.form['pickup_datetime']
#         pickup_longitude = float(request.form['pickup_longitude'])
#         pickup_latitude = float(request.form['pickup_latitude'])
#         dropoff_longitude = float(request.form['dropoff_longitude'])
#         dropoff_latitude = float(request.form['dropoff_latitude'])
#         passenger_count = int(request.form['passenger_count'])
        
        
#         pickup_datetime = datetime.strptime( pickup_datetime, '%Y-%m-%dT%H:%M')
        
        
#         year =  pickup_datetime.year
#         month =  pickup_datetime.month
#         day=  pickup_datetime.day
#         hour =  pickup_datetime.hour
#         minute=  pickup_datetime.minute
#         second=  pickup_datetime.second
        
#         distance = calculate_distance( pickup_longitude, pickup_latitude,dropoff_longitude,dropoff_latitude )
        
#         X=[[ pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude,passenger_count,distance,year,month,day,hour,minute,second]]
        
        
#         # return render_template('index.html',fare = f" fare = ${fare_amount(X) * passenger_count }")

#         return render_template('index.html', fare=round(fare_amount(X) * passenger_count))
    
    
#     return render_template('index.html',fare = f" fare = ${ 0.00 }")


# if __name__ == '__main__':
#     app.run(debug = True)

# import os

if __name__ == "__main__":
    port = 5000
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )




