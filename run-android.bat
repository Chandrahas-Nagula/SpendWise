@echo off
set ANDROID_HOME=C:\Users\Chandrahas\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%

echo [1/3] Checking emulator...
adb devices -l

echo [2/3] Installing APK...
adb install -r "d:\Expense Tracker\SpendWise\android\app\build\outputs\apk\debug\app-debug.apk"
if errorlevel 1 (
    echo APK install failed. Retrying in 10 seconds...
    timeout /t 10 /nobreak >nul
    adb install -r "d:\Expense Tracker\SpendWise\android\app\build\outputs\apk\debug\app-debug.apk"
)

echo [3/3] Launching app and starting Metro...
cd /d "d:\Expense Tracker\SpendWise"
npx expo start --port 8081
