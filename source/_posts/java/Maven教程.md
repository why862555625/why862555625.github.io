---
title: Maven教程
tags:
  - java
categories: java
keywords: Maven教程
description: Maven教程
top_img: 设置false不显示顶部图片
sticky: 数值越大越靠前
cover: 首页封面
comments: false评论
abbrlink: 21effdcf
date: 2023-07-18 16:16:45
updated: 2023-07-18 16:16:45
---



摘要

<!-- more -->

## 1. Maven 是什么

Maven 是 Apache 软件基金会组织维护的一款专门为 Java 项目提供**构建**和**依赖**管理支持的工具。



一个 Maven 工程有约定的目录结构，约定的目录结构对于 Maven 实现自动化构建而言是必不可少的一环，就拿自动编译来说，Maven 必须 能找到 Java 源文件，下一步才能编译，而编译之后也必须有一个准确的位置保持编译得到的字节码文件。 我们在开发中如果需要让第三方工具或框架知道我们自己创建的资源在哪，那么基本上就是两种方式：



1. 通过配置的形式明确告诉它
2. 基于第三方工具或框架的约定 Maven 对工程目录结构的要求

![image-20230718162731572](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718162731572.png)



### 1.1 构建

Java 项目开发过程中，构建指的是使用『**原材料生产产品**』的过程。



![image-20230718162753206](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718162753206.png)

构建过程主要包含以下环节：

![image-20230718162817262](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718162817262.png)

### 1.2 依赖

Maven 中最关键的部分，我们使用 Maven 最主要的就是使用它的依赖管理功能。当 A jar 包用到了 B jar 包中的某些类时，A 就对 B 产生了依赖，那么我们就可以说 A 依赖 B。



依赖管理中要解决的具体问题：



- jar 包的下载：使用 Maven 之后，jar 包会从规范的远程仓库下载到本地
- jar 包之间的依赖：通过依赖的传递性自动完成
- jar 包之间的冲突：通过对依赖的配置进行调整，让某些 jar 包不会被导入

## 2. Maven 开发环境配置

### 2.1 下载安装

首页：



[Maven – Welcome to Apache Maven](https://xie.infoq.cn/link?target=https%3A%2F%2Fmaven.apache.org%2F)



下载页面：



[Maven – Download Apache Maven](https://xie.infoq.cn/link?target=https%3A%2F%2Fmaven.apache.org%2Fdownload.cgi)

![image-20230718162850114](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718162850114.png)

或者你也可以选择之前的版本：



![image-20230718162909619](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718162909619.png)

然后里面选择自己对应的版本下载即可：



![image-20230718162927263](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718162927263.png)

下载之后解压到**非中文、没有空格**的目录，如下：



![image-20230718162953121](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718162953121.png)



### 2.2 指定本地仓库

本地仓库默认值：用户家目录/.m2/repository。由于本地仓库的默认位置是在用户的家目录下，而家目录往往是在 C 盘，也就是系统盘。将来 Maven 仓库中 jar 包越来越多，仓库体积越来越大，可能会拖慢 C 盘运行速度，影响系统性能。所以建议将 Maven 的本地仓库放在其他盘符下。配置方式如下：

![image-20230718163226250](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163226250.png)

本地仓库这个目录，我们手动创建一个空的目录即可。



**记住**：一定要把 localRepository 标签**从注释中拿出来**。



**注意**：本地仓库本身也需要使用一个**非中文、没有空格**的目录。



### 2.3 配置阿里云提供的镜像仓库

Maven 下载 jar 包默认访问境外的中央仓库，而国外网站速度很慢。改成阿里云提供的镜像仓库，**访问国内网站**，可以让 Maven 下载 jar 包的时候速度更快。配置的方式是：

1. 将原有的例子配置注释掉

   ![](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163244605.png)

1. 加入自己的配置

![image-20230718163306018](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163306018.png)

### 2.4 配置基础 JDK 版本

如果按照默认配置运行，Java 工程使用的默认 JDK 版本是 1.5，而我们熟悉和常用的是 JDK 1.8 版本。修改配置的方式是：将 `profile` 标签整个复制到 settings.xml 文件的 `profiles` 标签内。

![image-20230718163336804](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163336804.png)

### 2.5 配置环境变量

Maven 是一个用 Java 语言开发的程序，它必须基于 JDK 来运行，需要通过 JAVA_HOME 来找到 JDK 的安装位置。

![image-20230718163355389](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163355389.png)

可以使用下面的命令验证：

![image-20230718163412454](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163412454.png)

然后新建环境变量：

![image-20230718163433104](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163433104.png)

> 配置环境变量的规律：
>
> XXX_HOME 通常指向的是 bin 目录的上一级
>
> PATH 指向的是 bin 目录

在配置 PATH

![image-20230718163510875](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163510875.png)

通过 `mvn -v` 验证：

![image-20230718163528303](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163528303.png)

## 3. Maven 的使用

### 3.1 核心概念：坐标

**数学中的坐标**使用 x、y、z 三个『**向量**』作为空间的坐标系，可以在『**空间**』中唯一的定位到一个『**点**』。

![image-20230718163558907](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163558907.png)

**Maven 中的坐标**使用三个『**向量**』在『**Maven 的仓库**』中**唯一**的定位到一个『**jar**』包。



- **groupId**：公司或组织的 id，即公司或组织域名的倒序，通常也会加上项目名称
- 例如：groupId：com.javatv.maven
- **artifactId**：一个项目或者是项目中的一个模块的 id，即模块的名称，将来作为 Maven 工程的工程名
- 例如：artifactId：auth
- **version**：版本号
- 例如：version：1.0.0



提示：坐标和仓库中 jar 包的存储路径之间的对应关系，如下

![image-20230718163619119](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163619119.png)

上面坐标对应的 jar 包在 Maven 本地仓库中的位置：

```maven
Maven本地仓库根目录\javax\servlet\servlet-api\2.5\servlet-api-2.5.jar
```

### 3.2 pom.xml

POM：**P**roject **O**bject **M**odel，项目对象模型。和 POM 类似的是：DOM（Document Object Model），文档对象模型。它们都是模型化思想的具体体现。



POM 表示将工程抽象为一个模型，再用程序中的对象来描述这个模型。这样我们就可以用程序来管理项目了。我们在开发过程中，最基本的做法就是将现实生活中的事物抽象为模型，然后封装模型相关的数据作为一个对象，这样就可以在程序中计算与现实事物相关的数据。



POM 理念集中体现在 Maven 工程根目录下 **pom.xml** 这个配置文件中。所以这个 pom.xml 配置文件就是 Maven 工程的核心配置文件。其实学习 Maven 就是学这个文件怎么配置，各个配置有什么用。

![image-20230718163722375](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163722375.png)



### 3.3 依赖

上面说到我们使用 Maven 最主要的就是使用它的依赖管理功能，引入依赖存在一个范围，maven 的依赖范围包括： `compile`，`provide`，`runtime`，`test`，`system`。



- **compile**：表示编译范围，指 A 在编译时依赖 B，该范围为**默认依赖范围**。编译范围的依赖会用在编译，测试，运行，由于运行时需要，所以编译范围的依赖会被打包。
- **provided**：provied 依赖只有当 jdk 或者一个容器已提供该依赖之后才使用。provide 依赖在编译和测试时需要，在运行时不需要。例如：servlet api 被 Tomcat 容器提供了。
- **runtime**：runtime 依赖在运行和测试系统时需要，但在编译时不需要。例如：jdbc 的驱动包。由于运行时需要，所以 runtime 范围的依赖会被打包。
- **test**：test 范围依赖在编译和运行时都不需要，只在测试编译和测试运行时需要。例如：Junit。由于运行时不需要，所以 test 范围依赖不会被打包。
- **system**：system 范围依赖与 provide 类似，但是必须显示的提供一个对于本地系统中 jar 文件的路径。一般不推荐使用。

而在实际开发中，我们常用的就是 `compile`、`test`、`provided` 。

### 3.4 依赖的传递

A 依赖 B，B 依赖 C，那么在 A 没有配置对 C 的依赖的情况下，A 里面能不能直接使用 C？



再以上的前提下，C 是否能够传递到 A，取决于 B 依赖 C 时使用的依赖范围。



- B 依赖 C 时使用 compile 范围：可以传递
- B 依赖 C 时使用 test 或 provided 范围：不能传递，所以需要这样的 jar 包时，就必须在需要的地方明确配置依赖才可以。

### 3.5 依赖的排除

当 A 依赖 B，B 依赖 C 而且 C 可以传递到 A 的时候，A 不想要 C，需要在 A 里面把 C 排除掉。而往往这种情况都是为了避免 jar 包之间的冲突。

![image-20230718163823784](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163823784.png)

所以配置依赖的排除其实就是阻止某些 jar 包的传递。因为这样的 jar 包传递过来会和其他 jar 包冲突。



一般通过使用`excludes`标签配置依赖的排除：

![image-20230718163844025](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163844025.png)

### 3.6 继承

#### 3.6.1 概念

Maven 工程之间，A 工程继承 B 工程



- B 工程：父工程
- A 工程：子工程



本质上是 A 工程的 pom.xml 中的配置继承了 B 工程中 pom.xml 的配置。

#### 3.6.2 作用

在父工程中统一管理项目中的依赖信息，具体来说是管理依赖信息的版本。



它的背景是：



- 对一个比较大型的项目进行了模块拆分。
- 一个 project 下面，创建了很多个 module。
- 每一个 module 都需要配置自己的依赖信息。



它背后的需求是：



- 在每一个 module 中各自维护各自的依赖信息很容易发生出入，不易统一管理。
- 使用同一个框架内的不同 jar 包，它们应该是同一个版本，所以整个项目中使用的框架版本需要统一。
- 使用框架时所需要的 jar 包组合（或者说依赖信息组合）需要经过长期摸索和反复调试，最终确定一个可用组合。这个耗费很大精力总结出来的方案不应该在新的项目中重新摸索。



通过在父工程中为整个项目维护依赖信息的组合既**保证了整个项目使用规范、准确的 jar 包**；又能够将**以往的经验沉淀**下来，节约时间和精力。

#### 3.6.3 一个例子

**① 一般再模块化开发中一般都会创建一个父工程，如下**：

![image-20230718163937475](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163937475.png)

![image-20230718163955261](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718163955261.png)



父工程创建好之后，要修改它的打包方式：



```xml
<!-- 当前工程作为父工程，它要去管理子工程，所以打包方式必须是 pom --><packaging>pom</packaging>
```

只有打包方式为 pom 的 Maven 工程能够管理其他 Maven 工程。打包方式为 pom 的 Maven 工程中不写业务代码，它是专门管理其他 Maven 工程的工程，所以可以将生成的 src 目录删除。



**② 创建模块工程**

![image-20230718164033287](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164033287.png)

![image-20230718164045231](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164045231.png)

![image-20230718164056861](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164056861.png)

然后可以再**父工程**的 pom 文件中看到：

![image-20230718164121375](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164121375.png)

而**子工程**的 pom 如下：



![image-20230718164142233](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164142233.png)





**③ 在父工程中配置依赖的统一管理**



使用`dependencyManagement`标签配置对依赖的管理，如下：



```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>net.javatv.maven</groupId>
    <artifactId>maven-demo-parent</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>
    <modules>
        <module>demo-module</module>
    </modules>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-beans</artifactId>
                <version>5.3.19</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-core</artifactId>
                <version>5.3.19</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-context</artifactId>
                <version>5.3.19</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-aop</artifactId>
                <version>5.3.19</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```



而实际上**被管理的依赖并没有真正被引入到工程**。



**④ 子工程中引用那些被父工程管理的依赖**



关键点：省略版本号



子工程引用父工程中的依赖信息时，可以把版本号去掉。把版本号去掉就表示子工程中这个依赖的版本由父工程决定，具体来说是由父工程的 dependencyManagement 来决定。



子工程 pom 如下：



```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 使用parent标签指定当前工程的父工程 -->
    <parent>
        <artifactId>maven-demo-parent</artifactId>
        <groupId>net.javatv.maven</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>
    <!-- 子工程的坐标 -->    <!-- 如果子工程坐标中的groupId和version与父工程一致，那么可以省略 -->
    <artifactId>demo-module</artifactId>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-beans</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
        </dependency>
    </dependencies>
</project>
```





此时，**被管理的依赖才被引入到工程**。

![image-20230718164447635](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164447635.png)



**⑤ 修改父工程依赖信息的版本**



这个修改可以是降级，也可以是升级，但一般来说都是升级。

![image-20230718164506947](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164506947.png)



**⑥ 父工程中声明自定义属性**



对同一个框架的一组 jar 包最好使用相同的版本，为了方便升级框架，可以将 jar 包的版本信息统一提取出来，统一声明版本号 ：



```xml
<!-- 通过自定义属性，统一指定Spring的版本 -->
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>    <!-- 自定义标签，维护Spring版本数据 -->
    <spring.version>5.3.19</spring.version>
</properties>
```



在需要的地方使用`${}`的形式来引用自定义的属性名，真正实现**一处修改，处处生效**。



```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>net.javatv.maven</groupId>
    <artifactId>maven-demo-parent</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>
    <modules>
        <module>demo-module</module>
    </modules>

    <!-- 通过自定义属性，统一指定Spring的版本 -->
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <!-- 自定义标签，维护Spring版本数据 -->
        <spring.version>5.3.19</spring.version>
    </properties>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-beans</artifactId>
                <version>${spring.version}</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-core</artifactId>
                <version>${spring.version}</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-context</artifactId>
                <version>${spring.version}</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-aop</artifactId>
                <version>${spring.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```





编写一套符合要求、开发各种功能都能正常工作的依赖组合并不容易。如果公司里已经有人总结了成熟的组合方案，那么再开发新项目时，如果不使用原有的积累，而是重新摸索，会浪费大量的时间。为了提高效率，我们可以使用工程继承的机制，让成熟的依赖组合方案能够保留下来。如下：

![image-20230718164607769](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164607769.png)

如上图所示，公司级的父工程中管理的就是成熟的依赖组合方案，各个新项目、子系统各取所需即可。

### 3.7 聚合

聚合，指分散的聚集到一起，即部分组成整体。

#### 3.7.1 Maven 中的聚合

使用一个**总工程**将各个**模块工程**汇集起来，作为一个整体对应完整的项目，实际就是 `module` 标签。

- 项目：整体
- 模块：部分

#### 3.7.2 继承和聚合的对应关系

从继承关系角度来看：

- 父工程
- 子工程

从聚合关系角度来看：

- 总工程
- 模块工程

#### 3.7.3 聚合的配置

在总工程中配置 modules 即可：

```xml
<modules>    <module>demo-module</module></modules>
```

#### 3.7.4 依赖循环问题

如果 A 工程依赖 B 工程，B 工程依赖 C 工程，C 工程又反过来依赖 A 工程，那么在执行构建操作时会报下面的错误：



```text
DANGER
[ERROR] [ERROR] The projects in the reactor contain a cyclic reference:
```



这个错误的含义是：循环引用。

## 4. build 标签

在实际使用 Maven 的过程中，我们会发现 build 标签有时候有，有时候没，这是怎么回事呢？其实通过有效 POM 我们能够看到，build 标签的相关配置其实一直都在，只是在我们需要定制构建过程的时候才会通过配置 build 标签覆盖默认值或补充配置。这一点我们可以通过打印有效 POM 来看到。



> 打印有效 pom
>
> mvn help:effective-pom



当默认配置无法满足需求的定制构建的时候，就需要使用 build 标签。

### 4.1 build 标签的组成

build 标签的子标签大致包含三个主体部分：

![image-20230718164646398](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164646398.png)

#### 4.1.1 定义约定的目录结构

```xml
<sourceDirectory>D:\product\maven-demo-parent\demo-module\src\main\java</sourceDirectory><scriptSourceDirectory>
D:\product\maven-demo-parent\demo-module\src\main\scripts
</scriptSourceDirectory><testSourceDirectory>D:\product\maven-demo-parent\demo-module\src\test\java
</testSourceDirectory><outputDirectory>D:\product\maven-demo-parent\demo-module\target\classes
</outputDirectory><testOutputDirectory>D:\product\maven-demo-parent\demo-module\target\test-classes
</testOutputDirectory><resources>
<resource>
    <directory>D:\product\maven-demo-parent\demo-module\src\main\resources</directory>
</resource>
</resources><testResources>
<testResource>
    <directory>D:\product\maven-demo-parent\demo-module\src\test\resources</directory>
</testResource>
</testResources><directory>D:\product\maven-demo-parent\demo-module\target</directory><finalName>
demo-module-1.0-SNAPSHOT
</finalName>
```

各个目录的作用如下：



#### 4.1.2 备用插件管理

pluginManagement 标签存放着几个极少用到的插件：

- maven-antrun-plugin
- maven-assembly-plugin
- maven-dependency-plugin
- maven-release-plugin

通过 pluginManagement 标签管理起来的插件就像 dependencyManagement 一样，子工程使用时可以省略版本号，起到在父工程中统一管理版本的效果。

#### 4.1.3 生命周期插件

plugins 标签存放的是默认生命周期中实际会用到的插件，这些插件想必大家都不陌生，所以抛开插件本身不谈，plugin 标签的结构如下：

```xml
<plugin>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.1</version>
    <executions>
        <execution>
            <id>default-compile</id>
            <phase>compile</phase>
            <goals>
                <goal>compile</goal>
            </goals>
        </execution>
        <execution>
            <id>default-testCompile</id>
            <phase>test-compile</phase>
            <goals>
                <goal>testCompile</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**① 坐标部分**

artifactId 和 version 标签定义了插件的坐标，作为 Maven 的自带插件这里省略了 groupId。

**② 执行部分**

executions 标签内可以配置多个 execution 标签，execution 标签内：

- id：指定唯一标识
- phase：关联的生命周期阶段
- goals/goal：关联指定生命周期的目标
- goals 标签中可以配置多个 goal 标签，表示一个生命周期环节可以对应当前插件的多个目标。

### 4.2 典型应用：指定 JDK 版本

前面我们在 settings.xml 中配置了 JDK 版本，那么将来把 Maven 工程部署都服务器上，脱离了 settings.xml 配置，如何保证程序正常运行呢？思路就是我们直接把 JDK 版本信息告诉负责编译操作的 maven-compiler-plugin 插件，让它在构建过程中，按照我们指定的信息工作。如下：

```xml
<!-- build 标签：意思是告诉 Maven，你的构建行为，我要开始定制了！ -->
<build>    <!-- plugins 标签：Maven 你给我听好了，你给我构建的时候要用到这些插件！ -->
    <plugins>        <!-- plugin 标签：这是我要指定的一个具体的插件 -->
        <plugin>            <!-- 插件的坐标。此处引用的 maven-compiler-plugin 插件不是第三方的，是一个 Maven 自带的插件。 -->
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.1</version>                        <!-- configuration 标签：配置 maven-compiler-plugin 插件 -->
            <configuration>                <!-- 具体配置信息会因为插件不同、需求不同而有所差异 -->
                <source>1.8</source>
                <target>1.8</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
    </plugins>
</build>
```

- settings.xml 中配置：仅在本地生效，如果脱离当前 settings.xml 能够覆盖的范围，则无法生效。
- 在当前 Maven 工程 pom.xml 中配置：无论在哪个环境执行编译等构建操作都有效。

### 4.3 典型应用：SpringBoot 定制化打包

很显然 spring-boot-maven-plugin 并不是 Maven 自带的插件，而是 SpringBoot 提供的，用来改变 Maven 默认的构建行为。具体来说是改变打包的行为。默认情况下 Maven 调用 maven-jar-plugin 插件的 jar 目标，生成普通的 jar 包。



普通 jar 包没法使用 java -jar xxx.jar 这样的命令来启动、运行，但是 SpringBoot 的设计理念就是每一个『**微服务**』导出为一个 jar 包，这个 jar 包可以使用 java -jar xxx.jar 这样的命令直接启动运行。



这样一来，打包的方式肯定要进行调整。所以 SpringBoot 提供了 spring-boot-maven-plugin 这个插件来定制打包行为。



```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>2.5.5</version>
        </plugin>
    </plugins>
</build>
```

## 5. 依赖配置补充

管理依赖最基本的办法是继承父工程，但是和 Java 类一样，Maven 也是单继承的。如果不同体系的依赖信息封装在不同 POM 中了，没办法继承多个父工程怎么办？这时就可以使用 import 依赖范围。

### 5.1 import

典型案例当然是在项目中引入 SpringBoot、SpringCloud 依赖：

```xml
<dependencyManagement>
    <dependencies>        <!-- SpringCloud 微服务 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>                <!-- SpringCloud Alibaba 微服务 -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>${spring-cloud-alibaba.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

import 依赖范围使用要求：

- 打包类型必须是 pom
- 必须放在 dependencyManagement 中



> 官网说明如下：
>
> This scope is only supported on a dependency of type `pom` in the `<dependencyManagement>` section. It indicates the dependency is to be replaced with the effective list of dependencies in the specified POM's `<dependencyManagement>` section. Since they are replaced, dependencies with a scope of `import` do not actually participate in limiting the transitivity of a dependency.

### 5.2 system

以 Windows 系统环境下开发为例，假设现在 `D:\product\maven-demo-parent\demo-module\target\demo-module-1.0-SNAPSHOT.jar` 想要引入到我们的项目中，此时我们就可以将依赖配置为 system 范围：

```xml
<dependency>
    <groupId>net.javatv.maven</groupId>
    <artifactId>demo-module</artifactId>
    <version>1.0-SNAPSHOT</version>
    <systemPath>D:\product\maven-demo-parent\demo-module\target\demo-module-1.0-SNAPSHOT.jar</systemPath>
    <scope>system</scope>
</dependency>
```

但是很明显：这样引入依赖完全不具有可移植性，所以**不要使用**。

### 5.3 runtime

专门用于编译时不需要，但是运行时需要的 jar 包。比如：编译时我们根据接口调用方法，但是实际运行时需要的是接口的实现类。典型案例是：

```xml
<!--热部署 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

## 6. profile

### 6.1 profile 概述

![image-20230718164920473](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164920473.png)

这里我们可以对接 profile 这个单词中『**侧面**』这个含义：项目的每一个运行环境，相当于是项目整体的一个侧面。



![image-20230718164953119](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718164953119.png)



通常情况下，我们项目至少有三种运行环境：

- 开发环境：供不同开发工程师开发的各个模块之间互相调用、访问；内部使用
- 测试环境：供测试工程师对项目的各个模块进行功能测试；内部使用
- 生产环境：供最终用户访问——所以这是正式的运行环境，对外提供服务

![image-20230718165021114](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718165021114.png)





而我们这里的『环境』仍然只是一个笼统的说法，实际工作中一整套运行环境会包含很多种不同服务器：

- MySQL
- Redis
- ElasticSearch
- RabbitMQ
- FastDFS
- Nginx
- Tomcat
- ……



就拿其中的 MySQL 来说，不同环境下的访问参数肯定完全不同，可是代码只有一套。如果在 jdbc.properties 里面来回改，那就太麻烦了，而且很容易遗漏或写错，增加调试的难度和工作量。所以最好的办法就是把适用于各种不同环境的配置信息分别准备好，部署哪个环境就激活哪个配置。



在 Maven 中，使用 profile 机制来管理不同环境下的配置信息。但是解决同类问题的类似机制在其他框架中也有，而且从模块划分的角度来说，持久化层的信息放在构建工具中配置也违反了『高内聚，低耦合』的原则。



实际上，即使我们在 pom.xml 中不配置 profile 标签，也已经用到 profile 了。为什么呢？因为根标签 project 下所有标签相当于都是在设定默认的 profile。这样一来我们也就很容易理解下面这句话：project 标签下除了 modelVersion 和坐标标签之外，其它标签都可以配置到 profile 中。

### 6.2 profile 配置

#### 6.2.1 外部视角：配置文件

从外部视角来看，profile 可以在下面两种配置文件中配置：



- settings.xml：全局生效。其中我们最熟悉的就是配置 JDK 1.8。
- pom.xml：当前 POM 生效

#### 6.2.2 内部实现：具体标签

从内部视角来看，配置 profile 有如下语法要求：

**① profiles/profile 标签**

- 由于 profile 天然代表众多可选配置中的一个所以由复数形式的 profiles 标签统一管理。
- 由于 profile 标签覆盖了 pom.xml 中的默认配置，所以 profiles 标签通常是 pom.xml 中的最后一个标签。



**② id 标签**

每个 profile 都必须有一个 id 标签，指定该 profile 的唯一标识。这个 id 标签的值会在命令行调用 profile 时被用到。这个命令格式是：

```text
-D<profile id>
```

**③ 其它允许出现的标签**

一个 profile 可以覆盖项目的最终名称、项目依赖、插件配置等各个方面以影响构建行为。



- build
- defaultGoal
- finalName
- resources
- testResources
- plugins
- reporting
- modules
- dependencies
- dependencyManagement
- repositories
- pluginRepositories
- properties

### 6.3 激活 profile

**① 默认配置默认被激活**

前面提到了，POM 中没有在 profile 标签里的就是默认的 profile，当然默认被激活。

**② 基于环境信息激活**



环境信息包含：JDK 版本、操作系统参数、文件、属性等各个方面。一个 profile 一旦被激活，那么它定义的所有配置都会覆盖原来 POM 中对应层次的元素。可参考下面的标签结构：



```xml
<profile>
    <id>dev</id>
    <activation>        <!-- 配置是否默认激活 -->
        <activeByDefault>false</activeByDefault>
        <jdk>1.5</jdk>
        <os>
            <name>Windows XP</name>
            <family>Windows</family>
            <arch>x86</arch>
            <version>5.1.2600</version>
        </os>
        <property>
            <name>mavenVersion</name>
            <value>2.0.5</value>
        </property>
        <file>
            <exists>file2.properties</exists>
            <missing>file1.properties</missing>
        </file>
    </activation>
</profile>
```



这里有个问题是：多个激活条件之间是什么关系呢？



- Maven **3.2.2 之前**：遇到第一个满足的条件即可激活——**或**的关系。
- Maven **3.2.2 开始**：各条件均需满足——**且**的关系。

下面我们来看一个具体例子。假设有如下 profile 配置，在 JDK 版本为 1.6 时被激活：

```xml
<profiles>
    <profile>
        <id>JDK1.6</id>
        <activation>            <!-- 指定激活条件为：JDK 1.6 -->
            <jdk>1.6</jdk>
        </activation>
        ……
    </profile>
</profiles>
```

这里需要指出的是：Maven 会自动检测当前环境安装的 JDK 版本，只要 JDK 版本是以 1.6 开头都算符合条件。下面几个例子都符合：

- 1.6.0_03
- 1.6.0_02
- ……

### 6.4 Maven profile 多环境管理

在开发过程中，我们的软件会面对不同的运行环境，比如开发环境、测试环境、生产环境，而我们的软件在不同的环境中，有的配置可能会不一样，比如数据源配置、日志文件配置、以及一些软件运行过程中的基本配置，那每次我们将软件部署到不同的环境时，都需要修改相应的配置文件，这样来回修改，很容易出错，而且浪费劳动力。



因此我们可以利用 Maven 的 profile 来进行定义多个 profile，然后每个 profile 对应不同的激活条件和配置信息，从而达到不同环境使用不同配置信息的效果。



```xml
<build>    <!-- profile对资源的操作 -->
    <resources>
        <resource>
            <directory>src/main/resources</directory>            <!-- 先排除所有环境相关的配置文件 -->
            <excludes>
                <exclude>application*.yml</exclude>
            </excludes>
        </resource>
        <resource>
            <directory>src/main/resources
            </directory>            <!-- 是否替换 @xx@ 表示的maven properties属性值 -->            <!--通过开启 filtering，maven 会将文件中的 @xx@ 替换 profile 中定义的 xx 变量/属性-->
            <filtering>true</filtering>
            <includes>
                <include>application.yml</include>
                <include>application-${profileActive}.yml</include>
            </includes>
        </resource>
    </resources>
</build>

        <!--多环境文件配置--><profiles>    <!--开发环境-->
<profile>
    <id>dev</id>
    <activation>            <!--默认激活-->
        <activeByDefault>true</activeByDefault>
    </activation>
    <properties>
        <profileActive>dev</profileActive>
    </properties>
</profile>    <!--测试环境-->
<profile>
    <id>test</id>
    <properties>
        <profileActive>test</profileActive>
    </properties>
</profile>    <!--正式环境-->
<profile>
    <id>prod</id>
    <properties>
        <profileActive>prod</profileActive>
    </properties>
</profile>
</profiles>
```



在 idea 中可以看到，因此，当你需要打包哪一个环境的就勾选即可：



![image-20230718165207096](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718165207096.png)

同时，SpringBoot 天然支持多环境配置，一般来说，`application.yml`存放公共的配置，`application-dev.yml`、`application-test.yml`、`application.prod.yml`分别存放三个环境的配置。如下：

![image-20230718165231318](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718165231318.png)

`application.yml` 中配置`spring.profiles.active=prod`（或者 dev、test）指定使用的配置文件，如下：

![image-20230718165251938](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718165251938.png)

注：`profileActive`，就是上面我们自定义的标签。

然后当我们勾选哪一个环境，打包的配置文件就是那一个环境：

![image-20230718165326261](https://raw.githubusercontent.com/why862555625/images/main/imagesimage-20230718165326261.png)

同时我们再在 resource 标签下看到 includes 和 excludes 标签。它们的作用是：



- includes：指定执行 resource 阶段时要包含到目标位置的资源
- excludes：指定执行 resource 阶段时要排除的资源

