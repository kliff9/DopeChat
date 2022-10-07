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

    #     Available = True
    #     rooms = [Room002, Room006, Room008]
    #     max = 2
    #     if Available:
    #         room = random.choice(rooms)
    #         Available = False # use old room name

    #     if max == 2: # generate a new value
    #         room = random.choice(rooms)
    #         max = 0
    #     print('Rooms:', room)

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
        def Randomfunction(Rooms):
            Available_room = None
            for x in range(0, len(Rooms)):
                if Rooms[x]["max"] == 1:

                    Available_room = x
                    Rooms[x]["max"] += 1
                    Rooms[x]["Available"] = False


            if Available_room is None:
                try:
                    Available_rooms_left = [x for x in Rooms if x["Available"] == True]
                    Rn = random.randint(0,len(Available_rooms_left) - 1)


                    Available_room = Available_rooms_left[Rn]
                    Available_room["max"] += 1
                except:
                    print("An exception occurred")


        y = 0
        while y < 7:
            Randomfunction(Rooms)
            y += 1
        expected_Rooms =  [{'id': 1, 'RoomName': 'Room002', 'max': 2, 'Available': False}, {'id': 2, 'RoomName': 'Room006', 'max': 2, 'Available': False}, {'id': 3, 'RoomName': 'Room008', 'max': 2, 'Available': False}]

        self.assertEqual(Rooms, expected_Rooms)
        print('Rooms: ', Rooms)

    def test_Remove_Random_Room(self):

        Room.objects.create(
            RoomName='BlueRoom',
            max=2,
            Available=False
            )
        Room.objects.create(
            RoomName='WhiteRoom',
            max=2,
            Available=False
            )

        _Room_ = Room.objects.get(
        RoomName="BlueRoom"
        )

        _Room_.max -= 1
        _Room_.Available = True
        print(_Room_.Available)
        self.assertEqual(_Room_.max, 1)
        self.assertEqual(_Room_.Available, True)


