If you are using anaconda:
```sh
conda create --name backend
conda activate backend
pip install -r requirements.txt
```
If you are using virtualenv:
```sh
virtualenv backend
backend\Scripts\activate
pip install -r requirements.txt
```
```sh
python3 manage.py runserver --noreload [port]
```
