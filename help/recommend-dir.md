# 推荐的目录结构

## 构建过程
![图](http://ydrimg.oss-cn-hangzhou.aliyuncs.com/20140925221717882240895434.png)



## 目录结构
![图](http://ydrimg.oss-cn-hangzhou.aliyuncs.com/20140925221739397755733124.png)


## 什么是源和目标

- 源：开发环境
- 目标：生产环境

在通用的开发过程中，都会在发布之后，切换模板等资源指向。如上，开发过程中，指向`src`目录，而当
进入生产环境之后，就切换指向`dest`目录。

## 构建后的入口文件示例

![图](http://ydrimg.oss-cn-hangzhou.aliyuncs.com/20140925222158619977197480.png)

