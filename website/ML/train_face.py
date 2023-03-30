import os
from os import listdir
from PIL import Image
from numpy import asarray
from numpy import expand_dims
# from keras.models import load_model
import numpy as np
import io
import base64
import cv2

from deepface.basemodels.Facenet import loadModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# image_dir = os.path.join(BASE_DIR, "fotoPeserta")
model_dir = os.path.join(BASE_DIR, "model")
proto_path = os.path.join(model_dir,'deploy.prototxt')
model_path = os.path.join(model_dir,'res10_300x300_ssd_iter_140000.caffemodel')
facenet_path = os.path.join(model_dir,'facenet_keras.h5')

ssd = cv2.dnn.readNetFromCaffe(proto_path, model_path)
# facenet = load_model(facenet_path)
facenet = loadModel()
# database = {}

def train_face(image, name):
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
        # pass our minumum probability threshold (helping filter out some weak detections)
        if confidence > 0.5:
            try:
                # compute the (x,y) coordinates of the bounding box
                # for the face and extract face ROI
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype('int')
                face = imagebgr[(startY):(endY), (startX):(endX)]

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

                # Normalisasi untuk masukan FaceNet dan expand jado 4 dimensi
                face = face.astype('float32')
                mean, std = face.mean(), face.std()
                face = (face - mean) / std

                face = expand_dims(face, axis=0)
                signature = facenet.predict(face)
                # signature_list = signature.tolist()
                signature_str = np.array2string(signature)

                label = name
                name_output = label

                res = cv2.rectangle(imagebgr, (startX, startY), (endX, endY), (0, 0, 255), 4)
                image_rgb = cv2.cvtColor(res, cv2.COLOR_BGR2RGB)
                imagergb_encode = cv2.imencode('.jpeg', image_rgb)[1]
                image_base64_byte = base64.b64encode(imagergb_encode)
                image_output = str(image_base64_byte, 'utf-8')
            except:
                print('gagal')
                pass

    return (image_output, name_output, signature_str)


'''
for root, dirs, files in os.walk(image_dir):
    id = 0
    for file in files:
        #print(files)

        if file.endswith("png") or file.endswith("jpg") or file.endswith("jpeg"):
            path = os.path.join(root, file)
            label = os.path.basename(root).replace(" ", "-").lower()
            id += 1
            label = label+"-"+str(id)
            imagebgr = cv2.imread(path)
            # construct a blob from the image (preprocess image)
            # basically, it does mean subtraction and scaling
            # (104.0, 177.0, 123.0) is the mean of image in FaceNet
            h, w = imagebgr.shape[:2]
            blob = cv2.dnn.blobFromImage(cv2.resize(imagebgr,(300,300)), 1.0,
                (300,300), (104.0, 177.0, 123.0))

            # pass the blob through the NN and obtain the detections
            ssd.setInput(blob)
            detections = ssd.forward()
            if len(detections) > 0:
                # we're making the assumption that each image has ONLY ONE face,
                # so find the bounding box with the largest probability
                i = np.argmax(detections[0, 0, :, 2])
                confidence = detections[0, 0, i, 2]
    
                # ensure that the detection with the highest probability 
                # pass our minumum probability threshold (helping filter out some weak detections)
                if confidence > 0.5:
                    try:
                        # compute the (x,y) coordinates of the bounding box
                        # for the face and extract face ROI
                        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                        (startX, startY, endX, endY) = box.astype('int')
                        face = imagebgr[(startY):(endY), (startX):(endX)]

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

                        # Normalisasi untuk masukan FaceNet dan expand jado 4 dimensi
                        face = face.astype('float32')
                        mean, std = face.mean(), face.std()
                        face = (face - mean) / std

                        face = expand_dims(face, axis=0)
                        signature = facenet.predict(face)

                        name = os.path.dirname(path)
                        database[label]=signature
                    except:
                        continue

    myfile = open("data.pkl", "wb")
    pickle.dump(database, myfile)
    myfile.close()

print(database)
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





