@echo off
echo Fixing Gradle Wrapper...

cd mobile\android

echo Downloading Gradle wrapper...
curl -L https://raw.githubusercontent.com/gradle/gradle/master/gradle/wrapper/gradle-wrapper.jar -o gradle\wrapper\gradle-wrapper.jar

echo.
echo Gradle wrapper fixed!
echo Now you can run: npm run android
pause

