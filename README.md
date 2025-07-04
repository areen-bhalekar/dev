
# Battery Health Hub

## CSV Sequence
0:Ignored

1:Voltage

2:Current

3:Temperature

4:Rem Cap

5:Discharge Time

6:Cycle

7:RSOC

8:SOH

9:Safety

10:Operation

11:Charging

12:Gauging

13:Cell 1

14:Cell 2

15:Cell 3

16:Cell 4

17:Cell 5

18:Cell 6

19:Serial Number

20:Full Cap

21:Cell 7

22:Device Name

23:Charging Time

How to clone the repository and run it on the local machine

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd renderer
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Then to install the backend dependencies in the project directory type
```bash
  npm install
```
Then type this to run the electron app
```bash
  npm run electron:start
```

Note: The frontend server should be turned on to show the content in the electron window

Note: After cloning the repo, in main.js line 78-79, comment the part according to the needs. If the app is in dev mode comment the line of the build file, and the other way round in the prod version

## Building the app

To build the app, run the following commands

```bash
  cd renderer
```
```bash
  npm run build
```
After this in the renderer folder, the frontend should have a build file.

Now to build as an executable, in the project directory run

```bash
  npm run build
```

Note: This command should be run in the admin terminal/powershell.

After completion a dist folder will be made in the project directory, which will have an ".exe" file for sharing
