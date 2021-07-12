# Video Conference and Chat application

This application has been hosted on Heroku. The link for the same is : https://video-con-kriti.herokuapp.com/login . 
1) The first page that appears is **chat room** . You need to input our name and create a chat room/join a chat room that has already been created.
Click on **Start Call**.
2) The next page would show the people present in the chat room. **Click Start**.
3) On clicking start, you would enter the chat rooom, which will have a chat as well as a video application. The chat application would be available irrespective of
whether the video call has been connected or not (in accordance to the challenge in adapt phase). You can **click on Join call**, and then wait for other participants
to do the same. Once they have joined the call, you will be able to see all of their videos as well as messages.
4) On clicking **Leave call**, you would be disconnected but the message interface would still be active.

## Setup
To run this on local machine,
Open terminal.
```
$ git clone https://github.com/kriti1799/Video-Con.git
$ cd Video-Con
```
Install the dependencies.
```
$ pip install -r requirements.txt
```

Once ```pip``` has finished downloading the dependencies:
```
$ cd Sample
$ python manage.py runserver
```
And navigate to ```localhost:8000/login/ ```
The database can be found at ```localhost:8000/admin/```
The next steps are the same as above.

### Building blocks
For this software, I have used
1) HTML and CSS to build the front-end
2) Javascript for backend
3) Django Framework
4) Twilio API to integrate video and chat application.

Video link for my application : 

### More Information
I set up the project using Django framework.
1) The root folder contains .env, manage.py and to setup the Django application.
3) It also contains Procfile, requirements.txt and runtime.txt which are used for hosting the application.
4) There is also an sqlite file, required to setup the datbase.
5) There is a parent app folder within the root folder, Form which has all the required HTML ,CSS and JS codes.
6) The CSS and Javascript files can be found at ```Forms -> static -> Form```, whereas the HTML files can be found at ```Form -> templates -> Form ```.
7) Migrations in the Form folder are Django's way of propagating changes you make to your models (adding a field, deleting a model, etc.) into your
 database schema.
8) We also have a Sample subfolder in the root directory. It has files associated with handling URLS, all the settings,
hosting etc.
9) I have used Twilio programmable chat and programmable video to make my application.  
More information on Programmable chat : https://www.twilio.com/console/chat/getting-started  
More information on Programmable video : https://www.twilio.com/console/video/getting-started
