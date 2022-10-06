from django.test import TestCase

# Create your tests here.
from django.test import Client
import unittest

from .models import Room, RoomMember

import random

from django.http import JsonResponse
import random
import time
from agora_token_builder import RtcTokenBuilder


# class TestStringMethods(unittest.TestCase):
#     def setUp(self):
#         """Create user and client."""
#         self.client = Client()  # new instanced, django test client to make http request

#     def test_upper(self):
#         self.assertEqual('foo'.upper(), 'FOO')

#     def test_isupper(self):
#         self.assertTrue('FOO'.isupper())
#         self.assertFalse('Foo'.isupper())

#     def test_split(self):
#         s = 'hello world'
#         self.assertEqual(s.split(), ['hello', 'world'])
#         # check that s.split fails when the separator is not a string
#         with self.assertRaises(TypeError):
#             s.split(2)



class Test_Stream(TestCase):
    # def setUp(self):
    #     """Create user and client."""
    #     self.client = Client()  # new instanced, django test client to make http request
    #     # print(self.client)

    # def test_upper(self):
    #     self.assertEqual('foo'.upper(), 'FOO')
    #     s = 'hello world'
    #     self.assertEqual(s.split(), ['hello', 'world'])


    # def test_stream(self):

    #     appId = "afa463fb93f64fbb9dc55922464e29c9"
    #     appCertificate = "f3eb6c9429b84b01a9fc8f4270b6cb64"
    #     channelName = 'main'
    #     uid = random.randint(1, 230)
    #     expirationTimeInSeconds = 3600 * 24
    #     currentTimeStamp = int(time.time())
    #     privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    #     role = 1 # guest

    #     token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    #     print("Token with int uid: {}".format(token))


    #     print('content: ', JsonResponse({'token': token, 'uid': uid}, safe=False))
    #     # response = self.client.get('room')
    #     # print('content: ', response.content)



    # def test_randomRoom(self):

    #     Room002 = Room.objects.create(
    #         RoomName='Room002',
    #         max=2,
    #         Available=True 
    #         )
    #     Room006 = Room.objects.create(
    #         RoomName='Room006',
    #         max=2,
    #         Available=True 
    #         )
    #     Room008 = Room.objects.create(
    #         RoomName='Room008',
    #         max=2,
    #         Available=True 
    #         )

    #         Available = True
    #         rooms = [Room002, Room006, Room008]
    #         max = 2
    #         if Available:
    #             room = random.choice(rooms)
    #             Available = False # use old room name

    #         if max == 2: # generate a new value
    #             room = random.choice(rooms)
    #             max = 0 
    #         print('Rooms:', room)

    def test_RR(self):
    # Rooms = Room.objects.all()
        Room002 = Room.objects.create(
            RoomName='Room002',
            max=0,
            Available=True 
            )
        Room006 = Room.objects.create(
            RoomName='Room006',
            max=0,
            Available=True 
            )
        Room008 = Room.objects.create(
            RoomName='Room008',
            max=0,
            Available=True 
            )
        Rooms = list(Room.objects.values('id','RoomName', 'max', 'Available'))
    #     update = Room.objects.get(
    #         id=2
    #  )  
    #     update.max = 0
    #     update.save()
    #     print(update.max)
        def Randomfunction(Rooms):
            Available_room = None
            for x in range(0, len(Rooms)):
                if Rooms[x]["max"] == 1:
  
            
                    # print("Data: ", x, " is already in the system")
                    Available_room = x
                    Rooms[x]["max"] += 1
                    Rooms[x]["Available"] = False


            if Available_room is None:
                try:
                    Available_rooms_left = [x for x in Rooms if x["Available"] == True]  
                    print('Rooms Left', Available_rooms_left)                  
                    Rn = random.randint(0,len(Available_rooms_left) - 1)
       

                    Available_room = Available_rooms_left[Rn]
                    Available_room["max"] += 1
                except:
                    print("An exception occurred")

                # Rooms[Rn]["max"] += 1
                # print('Rooms Inside : ', Rooms)
            print(Available_room)
        Randomfunction(Rooms)
        Randomfunction(Rooms)
        Randomfunction(Rooms)
        Randomfunction(Rooms)
        Randomfunction(Rooms)
        Randomfunction(Rooms)
        Randomfunction(Rooms)

        print('Rooms: ', Rooms)


