from turtle import up
from django.shortcuts import render
from django.http import JsonResponse
import random
import time
from agora_token_builder import RtcTokenBuilder
from .models import Room, RoomMember
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import requires_csrf_token

from . import models


# Create your views here.
def Lobby(request):

    return render(request, 'base/Lobby.html')

def room(request):

    return render(request, 'base/room.html')

def Support(request):

    return render(request, 'base/Support.html')


def getToken(request): # get tokken to get access
    appId = "afa463fb93f64fbb9dc55922464e29c9"
    appCertificate = "f3eb6c9429b84b01a9fc8f4270b6cb64"
    channelName = request.GET.get('channel')
    uid = random.randint(1, 230)
    expirationTimeInSeconds = 3600 * 24
    currentTimeStamp = int(time.time())
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    role = 1 # guest

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    print("Token with int uid: {}".format(token))
    return JsonResponse({'token': token, 'uid': uid}, safe=False)


@csrf_exempt
# @requires_csrf_token
def createMember(request): # store and return name
    data = json.loads(request.body) # get data from frontend that in json format
    # If multiple objects are found, get_or_create() raises MultipleObjectsReturned. If an object is not found
    # , get_or_create() will instantiate and save a new object, returning a tuple of the new object and True.
    member, created = RoomMember.objects.get_or_create(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name'] # UID uqniquw to the room
            )
    print(data)
    return JsonResponse({'name':data['name']}, safe=False) # return the name back


def getMember(request):
    uid = request.GET.get('UID')
    room_name = request.GET.get('room_name')

    member = RoomMember.objects.get( # get by using 2 values
        uid=uid,
        room_name=room_name,
    )
    name = member.name
    return JsonResponse({'name':member.name}, safe=False)





def getUserList(request):
    roomName = request.GET.get('room_name')
    RoomMembers = RoomMember.objects.all()
    data2 = {"data": []}

    for x in RoomMembers:
        if x.room_name == roomName:
            data2["data"].append(x.name)
    print('userlist: ', data2)
    return JsonResponse({'users':data2["data"]}, safe=False)

@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)


def GenerateRandomRoom(request):
    # Rooms = Room.objects.all()
    Available_room = None
    Rooms = list(Room.objects.values('id','RoomName', 'max', 'Available'))
    # Rooms[-1]["max"] = 1 
    Rooms[0]["max"] = 1 
    update = Room.objects.get(
            id=2
     )  
    update.max = 0
    update.save()
    print(update.max)
    for x in Rooms:
        if x["max"] == 1:
  
            
            print("Data: ", x, " is already in the system")
            Available_room = x

    if Available_room is None:
        Available_room = random.choice(Rooms)

    print(Available_room)
    print("Update:  ", update.max)

    # Available = True
    # rooms = ['Bones', 'Psych', 'Big Bang Theory',  'Modern Family', ] 
    # max = 2
    # if Available:
    #     room = random.choice(rooms)
    #     Available = False # use old room name
    # max += 1
    # if max == 2: # generate a new value
    #     max = 0
    #     Available = True

    return JsonResponse({'room':Available_room }, safe=False)
