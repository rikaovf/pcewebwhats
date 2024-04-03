@echo off

taskkill -im WEBWHATS.exe -f

c:

cd \PCEWEB\Whatsapp

rem tem que copiar os arquivos abaixo para a pasta determinada em que sera executado o PCEWEB. pois são os arquivos html/lib dependendencias do servidor.
rem no caso esta copiando para a pasta da drogal para testes, porem o destino pode ser alterado de acordo com onde for rodar.
rem copiar arquivos prg, para html, conversão para facilitar o entendimento do prg no vscode.

del .\html\*.html

copy .\html\*.prg  .\html\*.html /Y

rem xcopy .\html  c:\work\html /I/E/Y/Q
rem xcopy .\lib   c:\work\lib /I/E/Y/Q
rem xcopy .\data  c:\work\data /I/E/Y/Q
rem xcopy .\files  c:\work\files /I/E/Y/Q
rem xcopy .\html\files  c:\work\files /I/E/Y/Q
rem xcopy c:\PCEWEB\files c:\work\files /I/E/Y/Q

xcopy .\html  f:\wsuporte\whatsapp\html /I/E/Y/Q
xcopy .\lib   f:\wsuporte\whatsapp\lib /I/E/Y/Q
xcopy .\data  f:\wsuporte\whatsapp\data /I/E/Y/Q
xcopy .\files f:\wsuporte\whatsapp\files /I/E/Y/Q

if exist "%ProgramFiles(x86)%\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" call "%ProgramFiles(x86)%\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" amd64

c:\harbour\bin\hbmk2 main.hbp -comp=msvc64

IF ERRORLEVEL 1 GOTO COMPILEERROR

xcopy c:\work\WEBWHATS.exe   f:\wsuporte\whatsapp /I/E/Y/Q

f:

cd \wsuporte\whatsapp

start WEBWHATS.exe

GOTO EXIT

:COMPILEERROR

echo *** Error

:EXIT

