FROM node

WORKDIR /code
ENTRYPOINT ['npm', 'install']
