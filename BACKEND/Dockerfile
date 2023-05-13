FROM python:3.8

WORKDIR /app

COPY . .

# RUN mkdir -p /root/.deepface/weights
# COPY facenet_weights.h5 /root/.deepface/weights

RUN mkdir -p /root/.keras-facenet/20180402-114759
COPY 20180402-114759-weights.h5 /root/.keras-facenet/20180402-114759

# install git
RUN apt-get update -y
# RUN apt-get install -y git
# RUN apt-get install -y cmake

# Install dlib
ENV CFLAGS=-static
ENV FLASK_APP=main.py

RUN pip3 install --upgrade pip 

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

#&& \
#    git clone -b 'v19.21' --single-branch https://github.com/davisking/dlib.git && \
#    cd dlib/ && \
#    python3 setup.py install --set BUILD_SHARED_LIBS=OFF

#RUN cd ..

RUN pip install -r req.txt

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]