from flask import Blueprint
from controllers import todos

api = Blueprint('api', __name__) 

api.register_blueprint(todos, url_prefix='/todo')
