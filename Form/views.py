from django.conf import settings
from django.http import JsonResponse

from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import ChatGrant, VideoGrant

from django.http.response import HttpResponse
from django.shortcuts import render
from .models import Data

# Create your views here.

def info(request): 
    return render (request, "Form/index.html")


def sub(request):
    name1 = request.POST["name"]
    room = request.POST["RoomNo"]

    
    
    if Data.objects.filter(roomNo = room).exists():
        
        namelist = Data.objects.filter(roomNo=room).exclude(name=name1)
        context = {'Data':namelist, 'UserName':name1, 'RoomNo':room}
        if Data.objects.filter(name = name1).exists():
            context = {'error' :"User with this name already exists!"}
            return render (request, "Form/index.html", context)
        else:    
            object1 = Data(name = name1, roomNo = room)
            object1.save()
            return render (request, "Form/join.html", context) 

    else:
        
        context = {'Data':"None", 'UserName':name1, 'RoomNo':room}
        object1 = Data(name = name1, roomNo = room)
        object1.save()
        return render (request, "Form/join.html", context)    

        #Join room URL directly
   
def chat(request):
    return render (request, "Form/chatRoom.html")
    #return HttpResponse("<h1> Chat Room entered</h1>")

def token(request):
    print("ABC")
    identity = Data.objects.last().name    #get name
    device_id = request.GET.get('device', 'default')  # unique device ID
    print(device_id)
    account_sid = settings.TWILIO_ACCOUNT_SID
    api_key = settings.TWILIO_API_KEY
    api_secret = settings.TWILIO_API_SECRET
    chat_service_sid = settings.TWILIO_CHAT_SERVICE_SID
    print(account_sid, api_key, api_secret, chat_service_sid)

    token = AccessToken(account_sid, api_key, api_secret, identity=identity)
    
     # Create a unique endpoint ID for the device
    endpoint = "MyDjangoChatRoom:{0}:{1}".format(identity, device_id)

    if chat_service_sid:
        chat_grant = ChatGrant(endpoint_id=endpoint,
                               service_sid=chat_service_sid)
        token.add_grant(chat_grant)

    response = {
        'identity': identity,
        'token': token.to_jwt().decode("utf-8")  
    }
    #print (response)
    return JsonResponse(response)
#return render (request, "Form/join.html") 

def leftroom(request):
    return render (request,"Form/index.html" )

def login(request):
    

     identity = Data.objects.last().name 
     room_vid = Data.objects.last().roomNo
     account_sid = settings.TWILIO_ACCOUNT_SID
     api_key = settings.TWILIO_API_KEY
     api_secret = settings.TWILIO_API_SECRET
     chat_service_sid = settings.TWILIO_CHAT_SERVICE_SID

     token = AccessToken(account_sid, api_key, api_secret, identity=identity)
     #print(token)
     token.add_grant(VideoGrant(room=room_vid))
     response = {
         'token' : token.to_jwt()
         

    }
     #print(JsonResponse(response))
     return JsonResponse(response)
