from django.shortcuts import render
from django.http import JsonResponse
import random
import time
from agora_token_builder import RtcTokenBuilder
from .models import RoomMember
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import requires_csrf_token

from . import models


# Create your views here.
@csrf_exempt
def Lobby(request):

    return render(request, 'base/Lobby.html')

def room(request):

    return render(request, 'base/room.html')


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
    room_name = request.GET.get('room_name')
    # name = request.GET.get('name')
    RoomMembers = models.RoomMember.objects.all()
    data2 = {"data": []}
    for x in RoomMembers:
        print(x)
        if x.room_name == room_name:
            data2["data"].append(x.name)
            print(data2)


    return JsonResponse({'data':data2["data"]}, safe=False)



@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )
    member.delete()
    return JsonResponse('Member has been removed', safe=False)
