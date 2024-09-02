# -*- coding:UTF-8 -*-
#该脚本用于加密资源图片 使用python3以上版本解释执行
__author__ = "zenskcode"
 
from operator import truediv
import os
import sys
from pickle import TRUE
import time

ENCRYPT_KEY = "version3_8_0" 				#指定加密秘钥,英文
ENCRYPT_SIGN = 'cocos_engine'  		    #添加于文件开头用于判断是否是加密文件

CUR_DIR = sys.argv[1] # 编译后资源所在的目录，这里是link模式。
print("cur_dir:",CUR_DIR)

 #判断是否已经经过加密避免重复加密
def isNotSigned(sign_byte):
    return   sign_byte != bytes(ENCRYPT_SIGN, "utf8")
 
def isNeedEncrptType(absPath):#判断是否是PNG图片
    """
    :param absPath: 文件的绝对路径
    :return: {Bool}
    """
    isFile = os.path.isfile(absPath)
    notSigned = False #默认为未加密
    fileExt = os.path.splitext(absPath)[1]

    if isFile:
        match fileExt:
            case ".png" | ".PNG" | ".jpg" | ".JPG" | ".jpeg" | ".JPEG": #这里加入需要加密的文件后缀
                print("fileExt True:", absPath)
                with open(absPath,"rb") as file:
                    signLen = len(bytes(ENCRYPT_SIGN, "utf8"))
                    notSigned = isNotSigned(file.read(signLen)[:signLen])
                    print("isNotSigned :", notSigned)
                    return notSigned
    return False
 
def preProcessFile(data):#可在此处预处理文件头尾
    """
    :param pata:
    :return:
    """
    return data

def encryption(fileData,key):#加密
    """
    加密文件数据
    :param fileData:{bytes}预处理后的数据
    :param key:{str}秘钥
    :return:{bytes}加密后的数据
    """
    assert type(key) is str
    k = bytes(key,"utf8")
    klen= len(k)
    kindex = 0
    fileData = bytearray(fileData)
    for i,v in enumerate(fileData):
        if kindex >= klen:
            kindex = 0
        fileData[i] = v ^ k[kindex] #加密
        kindex = kindex + 1
    return bytes(ENCRYPT_SIGN,"utf8") + fileData
 
#加密并写入文件
def processFile(filePath):
    global filenum
    fileData = None
    print("processFile :", filePath)
    with open(filePath,'rb') as file:
        fileData = encryption(preProcessFile(file.read()),ENCRYPT_KEY)
    os.remove(filePath)
    with open(filePath,'wb') as file: #覆盖新文件
        file.write(fileData)
    filenum = filenum + 1

def traverseDir(absDir):#遍历当前目录以及递归的子目录，找到所有的目标文件
    """
    :param absDir: 要遍历的路径
    :return: None
    """
    assert (os.path.isdir(absDir) and os.path.isabs(absDir))
    dirName = absDir
    for fileName in os.listdir(absDir):
        absFileName = os.path.join(dirName,fileName)
        if os.path.isdir(absFileName):#递归查找文件夹
            print("traverseDir:",absFileName)
            traverseDir(absFileName)
        elif isNeedEncrptType(absFileName):
            print("traverseDir isNeedEncrptType:",absFileName)
            processFile(absFileName)
        else:
            pass
    
 
 #------------------- 主函数-------------------------#
# start_clock = time.clock()
filenum = 0
traverseDir(CUR_DIR)
# end_clock = time.clock()
# time = (end_clock - start_clock)*1000
print("encrypt %d file Pictures"%filenum)
# print("use time %fms"%time)