from django.urls import path
from . import views


app_name = 'base'


urlpatterns = [
    path('', views.Lobby, name="Lobby"),
    path('room/', views.room),
    path('support/', views.Support, name="Support"),

    path('get_token/', views.getToken),

    path('create_member/', views.createMember),
    path('get_member/', views.getMember),
    path('get_user/', views.getUserList),
    path('get_RandomRoom/', views.GenerateRandomRoom),    
    path('delete_member/', views.deleteMember),
 ]
