from gpiozero import MotionSensor
import time
import requests

pir = MotionSensor(17)

print("Détecteur de mouvement PIR - Test")
print("Attendez, détectant les mouvements...")

try:
    # while True:
        # Détection du mouvement
        pir.wait_for_motion()
        print("Mouvement détecté at " + str(time.ctime()))
        # Envoyer du signal a notre WebApp
        url = 'http://172.210.82.238:2223/data'
        myobj = {'room': 'room-1', 'message': 'Movement detected'}
        x = requests.post(url, json = myobj)

        time.sleep(1)
        # Allumer la SmartTV
        url = 'http://192.168.0.155:8060/keypress/PowerOn'
        myobj = {'message': 'Lumos'}
        x = requests.post(url, json = myobj)

        # Si aucune détection du mouvement
        pir.wait_for_no_motion()
        print("Nothing moves")
        # Envoyer du signal a notre WebApp
        url = 'http://172.210.82.238:2223/data'
        myobj = {'room': 'room-1', 'message': 'Nothing moves'}
        x = requests.post(url, json = myobj)

        # Éteindre la SmartTV
        url = 'http://192.168.0.155:8060/keypress/PowerOff'
        myobj = {'message': 'No Lumos'}
        x = requests.post(url, json = myobj)

        time.sleep(0.1)

except KeyboardInterrupt:
    print("Interrupted!")
