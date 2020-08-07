*** Settings ***
Documentation     A resource file with reusable keywords and variables.
...
...               The system specific keywords created here form our own
...               domain specific language. They utilize keywords provided
...               by the imported SeleniumLibrary.
Library           SeleniumLibrary

*** Variables ***
${SERVER}         localhost:7272
${BROWSER}        chrome
${DELAY}          0
${VALID USER}     s@s.com
${VALID PASSWORD}    123123
${LOGIN URL}      file:///C:/Git/Lessons/private-lessons-project/login/index.html
${MAIN URL}    file:///C:/Git/Lessons/private-lessons-project/main/main.html?uid=vD4l7CPjNwazJnJ7OsyQ5Q5TwV72
${ERROR URL}      http://${SERVER}/error.html

*** Keywords ***
Open Browser To Login Page
    Open Browser    ${LOGIN URL}    ${BROWSER}
    #Maximize Browser Window
    Set Selenium Speed    ${DELAY}
    Login Page Should Be Open

Login Page Should Be Open
    Title Should Be    Languages

Go To Login Page
    Go To    ${LOGIN URL}
    Login Page Should Be Open

Input Username
    [Arguments]    ${username}
    Input Text    email    ${username}

Input Password
    [Arguments]    ${password}
    Input Text    password    ${password}

Submit Credentials
    Click Button    login_btn

Main Page Should Be Open
    Location Should Be    ${MAIN URL}
    Title Should Be    Welcome Page