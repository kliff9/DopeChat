from django.urls import path
from . import views


app_name = 'base'


urlpatterns = [
    path('', views.Lobby, name="Lobby"),
    path('room/', views.room),
    path('get_token/', views.getToken),

    path('create_member/', views.createMember),
    path('get_member/', views.getMember),
#     path('delete_member/', views.deleteMember),
 ]
