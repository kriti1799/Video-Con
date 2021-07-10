from django.urls import path, re_path
from . import views


urlpatterns = [
    path('login/', views.info, name = "FormInfo"),
    path('rooms/', views.sub, name = "FormSubmit" ),
    path('token/', views.token, name="token"),
    re_path(r'^rooms/\w+/',views.chat, name = "chatroom"),
    path('vid/', views.login, name = "Join_leave")
]
