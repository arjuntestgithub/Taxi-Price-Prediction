from flask import Flask
from flask import Flask, render_template, request, jsonify
from datetime import datetime
from geopy.distance import geodesic
import pickle


app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/papa")
def welcome():
    return "<p> I am your Father </p>"

@app.route("/arjun")
def love():
    return render_template('index.html',fare = 0)


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






@app.route('/predict',methods = ['POST'])
def predict():
    if request.method == 'POST':
        pickup_datetime = request.form['pickup_datetime']
        pickup_longitude = float(request.form['pickup_longitude'])
        pickup_latitude = float(request.form['pickup_latitude'])
        dropoff_longitude = float(request.form['pickup_longitude'])
        dropoff_latitude = float(request.form['dropoff_latitude'])
        passenger_count = int(request.form['passenger_count'])
        
        
        pickup_datetime = datetime.strptime( pickup_datetime, '%Y-%m-%dT%H:%M')
        
        
        year =  pickup_datetime.year
        month =  pickup_datetime.month
        day=  pickup_datetime.day
        hour =  pickup_datetime.hour
        minute=  pickup_datetime.minute
        second=  pickup_datetime.second
        
        distance = calculate_distance( pickup_longitude, pickup_latitude,dropoff_longitude,dropoff_latitude )
        
        
        
        
        
        
        
        X=[[ pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude,passenger_count,distance,year,month,day,hour,minute,second]]
        
        
        return render_template('index.html',fare = f" fare = ${fare_amount(X) * passenger_count }")
    
    
    return render_template('index.html',fare = f" fare = ${ 0.00 }")






if __name__ == '__main__':
    app.run(debug = True)
    
          
        
            
         
                              
                            































