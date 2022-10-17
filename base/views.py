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
from django.core.serializers import serialize

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
    print(data)
    member = RoomMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)


def GenerateRandomRoom(request):
    RoomsQuery = Room.objects.all()
    Available_room = None
    Rooms = list(Room.objects.values('id','RoomName', 'max', 'Available'))

    # update = Room.objects.get(
    #         id=2
    #  )
    # update.max = 0
    # update.save()

    for x in range(0, len(Rooms)):
        if Rooms[x]["max"] == 1:


            # print("Data: ", x, " is already in the system")
            Available_room = Rooms[x]
            # Rooms[x]["max"] += 1
            # Rooms[x]["Available"] = False
            update = Room.objects.get(
                id=Rooms[x]["id"]
                )
            update.max = 2
            update.Available = False
            update.save()

    if Available_room is None:
        try:
            Available_rooms_left = [x for x in Rooms if x["Available"] == True]
            print('Rooms Left', Available_rooms_left)
            Rn = random.randint(0,len(Available_rooms_left) - 1)


            Available_room = Available_rooms_left[Rn]
            # Available_room["max"] += 1
            update = Room.objects.get(
                id=Available_room["id"]
                )
            update.max = 1
            update.save()

        except:
            print("An exception occurred")

        # Rooms[Rn]["max"] += 1
        # print('Rooms Inside : ', Rooms)

    print(Available_room)
    print(Rooms)



    return JsonResponse({'room':Available_room }, safe=False)

# def GRR(request):
#     Rooms = Room.objects.all()

#     for x in Rooms:
#         if x.max == 0:
#             update = Room.objects.get(
#                 id=x.id
#             )

#         # print("Data: ", x, " is already in the system")
#             Available_room = json.dumps(x, default=str)
#             print(Available_room)
#     return JsonResponse({'room':"Rooim" }, safe=False)
@csrf_exempt
def RoomLeaving(request):
    data = json.loads(request.body)
    _Room_ = Room.objects.get(
        RoomName=data['RoomName']
    )

    _Room_.max -= 1
    _Room_.Available = True
    _Room_.save()
    print(_Room_.max, _Room_.Available)
    return JsonResponse({"message": "Room has been Cleared", "max": _Room_.max, "Available": _Room_.Available }, safe=False)
