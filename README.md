# dgc-dashboard
## Install Backend
edit database settings in `dgc-rest/dashboard/dashboard/settings.py` :
```
...
    'default': {
        'ENGINE': 'django.db.backends.oracle',
        'NAME': 'XE',
        'USER': 'TWUSER',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '1521',
    }
...
```
then install project dependencies:
```bash
cd dgc-rest/dashboard
python -m venv venv
source ./venv/bin/activate
pip install pdfkit psycopg2-binary django-filter django-cors-headers django-extensions djangorestframework django cx_Oracle
python manage.py runserver
```
## Install Frontend
```bash
yarn install
yarn start
```
