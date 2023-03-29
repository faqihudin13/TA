import os
from os import listdir
from PIL import Image
from numpy import asarray
from numpy import expand_dims
from keras.models import load_model
import numpy as np
import io
import base64
import cv2

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# image_dir = os.path.join(BASE_DIR, "fotoPeserta")
model_dir = os.path.join(BASE_DIR, "model")
proto_path = os.path.join(model_dir,'deploy.prototxt')
model_path = os.path.join(model_dir,'res10_300x300_ssd_iter_140000.caffemodel')
facenet_path = os.path.join(model_dir,'facenet_keras.h5')

ssd = cv2.dnn.readNetFromCaffe(proto_path, model_path)
facenet = load_model(facenet_path)

def recog_face (image, signature_db):
    b = bytes(image, 'utf-8')
    image = b[b.find(b'/9'):]
    im = Image.open(io.BytesIO(base64.b64decode(image)))
    imagebgr = np.array(im)

    h, w = imagebgr.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(imagebgr,(300,300)), 1.0, (300,300), (104.0, 177.0, 123.0))

    # pass the blob through the NN and obtain the detections
    ssd.setInput(blob)
    detections = ssd.forward()

    if len(detections) > 0:
        # we're making the assumption that each image has ONLY ONE face,
        # so find the bounding box with the largest probability
        i = np.argmax(detections[0, 0, :, 2])
        confidence = detections[0, 0, i, 2]

        # ensure that the detection with the highest probability 
        # pass our minumum probability threshold (helping filter out some weak detections
        if confidence > 0.5:
            
                # compute the (x,y) coordinates of the bounding box
                # for the face and extract face ROI
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype('int')
                face1 = imagebgr[(startY):(endY), (startX):(endX)]

                startX = abs(startX)
                startY = abs(startY)
                endX = abs(endX)
                endY = abs(endY)                    

                imagergb = cv2.cvtColor(imagebgr, cv2.COLOR_BGR2RGB)
                imagergb = Image.fromarray(imagergb)
                imagergb_array = asarray(imagergb)
                face = imagergb_array[(startY):(endY), (startX):(endX)]
                face = Image.fromarray(face)
                face = face.resize((160,160))
                face = asarray(face)

                # Normalisasi untuk masukan FaceNet dan expand jadi 4 dimensi
                face = face.astype('float32')
                mean, std = face.mean(), face.std()
                face = (face - mean) / std

                face = expand_dims(face, axis=0)
                signature = facenet.predict(face)
                signature = signature[0]

                min_dist=20
                identity=' '
                # dist = np.linalg.norm(signature_db-signature)
                dist = np.linalg.norm(np.subtract(signature_db,signature))
                if dist < min_dist:
                    min_dist = dist
                    # identity = name

                facenet_score = ((20 - dist)/20)*100
                facenet_score = round(facenet_score, 2)

                if (facenet_score < 50):
                    identity = "unknown"
                
                res = cv2.rectangle(imagebgr, (startX, startY), (endX, endY), (0, 0, 255), 4)
                image_rgb = cv2.cvtColor(res, cv2.COLOR_BGR2RGB)
                imagergb_encode = cv2.imencode('.jpeg', image_rgb)[1]
                image_base64_byte = base64.b64encode(imagergb_encode)
                image_output = str(image_base64_byte, 'utf-8')

                # name_output = name

                if facenet_score > 50:
                    result = "true"
                else:
                    result = "false"
            
    return (image_output, facenet_score, result)



'''
import os
from os import listdir
from PIL import Image
from numpy import asarray
from numpy import expand_dims
from matplotlib import pyplot
from keras.models import load_model
import numpy as np
import imutils
import pickle
import cv2
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
image_dir = os.path.join(BASE_DIR, "fotoPeserta")
model_dir = os.path.join(BASE_DIR, "model")
proto_path = os.path.join(model_dir,'deploy.prototxt')
model_path = os.path.join(model_dir,'res10_300x300_ssd_iter_140000.caffemodel')
facenet_path = os.path.join(model_dir,'facenet_keras.h5')

ssd = cv2.dnn.readNetFromCaffe(proto_path, model_path)
facenet = load_model(facenet_path)

myfile = open("data.pkl", "rb")
database = pickle.load(myfile)
myfile.close()

cap = cv2.VideoCapture(0)

while True:
        
        # grab the frame from the threaded video stream
        # and resize it to have a maximum width of 600 pixels
        _,frame = cap.read()
        cv2.putText(frame, "Press 'q' to quit", (20,35), cv2.FONT_HERSHEY_COMPLEX, 0.75, (0,255,0), 2)
        # grab the frame dimensions and convert it to a blob
        # blob is used to preprocess image to be easy to read for NN
        # basically, it does mean subtraction and scaling
        # (104.0, 177.0, 123.0) is the mean of image in FaceNet
        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300,300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
        
        # pass the blob through the network 
        # and obtain the detections and predictions
        prev_time = time.time()
        ssd.setInput(blob)
        detections = ssd.forward()

        # iterate over the detections
        for i in range(0, detections.shape[2]):
            # extract the confidence (i.e. probability) associated with the prediction
            confidence = detections[0, 0, i, 2]
            
            # filter out weak detections
            if confidence > 0.5:

                    # compute the (x,y) coordinates of the bounding box
                    # for the face and extract face ROI
                    box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                    (startX, startY, endX, endY) = box.astype('int')
                    face1 = frame[(startY):(endY), (startX):(endX)]

                    curr_time = time.time()
                    fps = 1 / (curr_time - prev_time)
                    fps = round(fps, 2)
                    curr_time = prev_time

                    ssd_score = (confidence*100)
                    ssd_score = round(ssd_score, 2)

                    startX = abs(startX)
                    startY = abs(startY)
                    endX = abs(endX)
                    endY = abs(endY)                    

                    imagergb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    imagergb = Image.fromarray(imagergb)
                    imagergb_array = asarray(imagergb)
                    face = imagergb_array[(startY):(endY), (startX):(endX)]
                    face = Image.fromarray(face)
                    face = face.resize((160,160))
                    face = asarray(face)

                    # Normalisasi untuk masukan FaceNet dan expand jadi 4 dimensi
                    face = face.astype('float32')
                    mean, std = face.mean(), face.std()
                    face = (face - mean) / std

                    face = expand_dims(face, axis=0)
                    signature = facenet.predict(face)

                    min_dist=100
                    identity=' '
                    for key, value in database.items() :
                        dist = np.linalg.norm(value-signature)
                        if dist < min_dist:
                            min_dist = dist
                            identity = key
                            # print(value)
                            # print(signature)

                    facenet_score = ((20 - dist)/20)*100
                    facenet_score = round(facenet_score, 2)

                    if (facenet_score < 50):
                        identity = "unknown"

                    name = identity.replace("-", " ")
                    name = name.rsplit(' ', 1)[0]
                    cv2.putText(frame, str("ssd_fps = ")+str(fps), (startX-10, endY + 50), cv2.FONT_HERSHEY_COMPLEX, 0.7, (0,130,255),2 )
                    cv2.putText(frame, name, (startX-10, endY + 30), cv2.FONT_HERSHEY_COMPLEX, 0.7, (0,130,255),2 )
                    cv2.rectangle(frame, (startX-10, startY-10), (endX+10, endY), (0, 0, 255), 4)
                    cv2.putText(frame, str("ssd_score = ")+str(ssd_score)+str("%"), (startX-10, startY - 35), cv2.FONT_HERSHEY_COMPLEX, 0.7, (0,130,255),2 )
                    cv2.putText(frame, str("facenet_score = ")+str(facenet_score)+str("%"), (startX-10, startY - 55), cv2.FONT_HERSHEY_COMPLEX, 0.7, (0,130,255),2 )
                    cv2.putText(frame, str("norm_score = ")+str(dist), (startX-10, startY - 75), cv2.FONT_HERSHEY_COMPLEX, 0.7, (0,130,255),2 )
        # show the output fame and wait for a key press
        cv2.imshow('Frame', frame)
        key = cv2.waitKey(1) & 0xFF
        # if 'q' is pressed, stop the loop
        # if that person appears 10 frames in a row, stop the loop
        # you can change this if your GPU run faster
        if key == ord('q'):
            break
        
# cleanup
# cap.stop()
cv2.destroyAllWindows()
# have some times for camera and CUDA to close normally
# (it can f*ck up GPU sometimes if you don't have high performance GPU like me LOL)
"""
print(startX)
print(startY)
print(endX)
print(endY)
print(face)

p = os.path.join('fotoPeserta', f'tes2.png')
cv2.imwrite(p, face)
print(f'[INFO] saved {p} to disk')
"""        

'''
