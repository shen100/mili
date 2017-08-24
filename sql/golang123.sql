# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.35)
# Database: golang123
# Generation Time: 2017-08-24 15:52:01 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table article_category
# ------------------------------------------------------------

DROP TABLE IF EXISTS `article_category`;

CREATE TABLE `article_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(11) unsigned NOT NULL,
  `category_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `article_category` WRITE;
/*!40000 ALTER TABLE `article_category` DISABLE KEYS */;

INSERT INTO `article_category` (`id`, `article_id`, `category_id`)
VALUES
	(52,33,15),
	(53,32,12),
	(74,34,12);

/*!40000 ALTER TABLE `article_category` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table articles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `articles`;

CREATE TABLE `articles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `browse_count` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `last_user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;

INSERT INTO `articles` (`id`, `name`, `browse_count`, `comment_count`, `status`, `content`, `created_at`, `updated_at`, `deleted_at`, `user_id`, `last_user_id`)
VALUES
	(32,'服务端 I/O 性能大比拼：Node、PHP、Java 和 Go',123,1,1,'理解应用程序的输入/输出（I/O）模型，意味着其在计划处理负载与残酷的实际使用场景之间的差异。若应用程序比较小，也没有服务于很高的负载，也许它影响甚微。但随着应用程序的负载逐渐上涨，采用错误的I/O模型有可能会让你到处踩坑，伤痕累累。\n   \n正如大部分存在多种解决途径的场景一样，重点不在于哪一种途径更好，而是在于理解如何进行权衡。让我们来参观下I/O的景观，看下可以从中窃取点什么。\n![](https://www.shen100.com/upload/img/2017/08/23/d1d2f698-ce8a-443a-af2b-e84bdf839ec2.jpg)\n\n在这篇文章，我们将会结合Apache分别比较Node，Java，Go，和PHP，讨论这些不同的语言如何对他们的I/O进行建模，各个模型的优点和缺点，并得出一些初步基准的结论。如果你关心下一个Web应用的I/O性能，那你就找对文章了。\n\n## I/O基础知识：快速回顾\n为了理解与I/O密切相关的因素，必须先来回顾在操作系统底层的概念。虽然不会直接处理这些概念的大部分，但通过应用程序的运行时环境你一直在间接地处理他们。而关键在于细节。\n### 系统调用\n首先，我们有系统调用，它可以描述成这样：\n\n* 你的程序（在“用户区域”，正如他们所说的）必须让操作系统内核在它自身执行I/O操作。\n* “系统调用”（syscall）意味着你的程序要求内核做某事。不同的操作系统，实现系统调用的细节有所不同，但基本的概念是一样的。这将会有一些特定的指令，把控制权从你的程序转交到内核（类似函数调用但有一些专门用于处理这种场景的特殊sauce）。通常来说，系统调用是阻塞的，意味着你的程序需要等待内核返回到你的代码。\n* 内核在我们所说的物理设备（硬盘、网卡等）上执行底层的I/O操作，并回复给系统调用。在现实世界中，内核可能需要做很多事情才能完成你的请求，包括等待设备准备就绪，更新它的内部状态等，但作为一名应用程序开发人员，你可以不用关心这些。以下是内核的工作情况。\n![](https://www.shen100.com/upload/img/2017/08/23/20eff7fa-e9ea-4856-9744-457c255325e3.jpg)\n\n### 阻塞调用与非阻塞调用\n好了，我刚刚在上面说系统调用是阻塞的，通常来说这是对的。然而，有些调用被分类为“非阻塞”，意味着内核接收了你的请求后，把它放进了队列或者缓冲的某个地方，然后立即返回而并没有等待实际的I/O调用。所以它只是“阻塞”了一段非常短的时间，短到只是把你的请求入列而已。\n\n这里有一些有助于解释清楚的（Linux系统调用）例子：-`read()` 是阻塞调用——你传给它一个文件句柄和一个存放所读到数据的缓冲，然后此调用会在当数据好后返回。注意这种方式有着优雅和简单的优点。-`epoll_create()`, `epoll_ctl()` 和 `epoll_wait()` 这些调用分别是，让你创建一组用于侦听的句柄，从该组添加/删除句柄，和然后直到有活动时才阻塞。这使得你可以通过一个线程有效地控制一系列I/O操作。如果需要这些功能，这非常棒，但也正如你所看到的，使用起来当然也相当复杂。\n\n理解这里分时差异的数量级是很重要的。如果一个CPU内核运行在3GHz，在没有优化的情况下，它每秒执行30亿次循环（或者每纳秒3次循环）。非阻塞系统调用可能需要10纳秒这样数量级的周期才能完成——或者“相对较少的纳秒”。对于正在通过网络接收信息的阻塞调用可能需要更多的时间——例如200毫秒（0.2秒）。例如，假设非阻塞调用消耗了20纳秒，那么阻塞调用消耗了200,000,000纳秒。对于阻塞调用，你的程序多等待了1000万倍的时间。\n![](https://www.shen100.com/upload/img/2017/08/23/c7fb0e81-ef74-4dcc-86d0-e61c08d6d7a8.jpg)\n\n内核提供了阻塞I/O（“从网络连接中读取并把数据给我”）和非阻塞I/O（“当这些网络连接有新数据时就告诉我”）这两种方法。而使用何种机制，对应调用过程的阻塞时间明显长度不同。\n\n### 调度\n接下来第三件关键的事情是，当有大量线程或进程开始阻塞时怎么办。\n\n出于我们的目的，线程和进程之间没有太大的区别。实际上，最显而易见的执行相关的区别是，线程共享相同的内存，而每个进程则拥有他们独自的内存空间，使得分离的进程往往占据了大量的内存。但当我们讨论调度时，它最终可归结为一个事件清单（线程和进程类似），其中每个事件需要在有效的CPU内核上获得一片执行时间。如果你有300个线程正在运行并且运行在8核上，那么你得通过每个内核运行一段很短的时间然后切换到下一个线程的方式，把这些时间划分开来以便每个线程都能获得它的分时。这是通过“上下文切换”来实现的，使得CPU可以从正在运行的某个线程/进程切换到下一个。\n\n这些上下文切换有一定的成本——它们消耗了一些时间。在快的时候，可能少于100纳秒，但是根据实现的细节，处理器速度/架构，CPU缓存等，消耗1000纳秒甚至更长的时间也并不罕见。\n\n线程（或者进程）越多，上下文切换就越多。当我们谈论成千上万的线程，并且每一次切换需要数百纳秒时，速度将会变得非常慢。\n\n然而，非阻塞调用本质上是告诉内核“当你有一些新的数据或者这些连接中的任意一个有事件时才调用我”。这些非阻塞调用设计于高效地处理大量的I/O负载，以及减少上下文切换。\n\n到目前为止你还在看这篇文章吗？因为现在来到了有趣的部分：让我们来看下一些流利的语言如何使用这些工具，并就在易用性和性能之间的权衡作出一些结论……以及其他有趣的点评。\n\n请注意，虽然在这篇文章中展示的示例是琐碎的（并且是不完整的，只是显示了相关部分的代码），但数据库访问，外部缓存系统（memcache等全部）和需要I/O的任何东西，都以执行某些背后的I/O操作而结束，这些和展示的示例一样有着同样的影响。同样地，对于I/O被描述为“阻塞”（PHP，Java）这样的情节，HTTP请求与响应的读取与写入本身是阻塞的调用：再一次，更多隐藏在系统中的I/O及其伴随的性能问题需要考虑。\n\n为项目选择编程语言要考虑的因素有很多。当你只考虑性能时，要考虑的因素甚至有更多。但是，如果你关注的是程序主要受限于I/O，如果I/O性能对于你的项目至关重要，那这些都是你需要了解的。“保持简单”的方法：PHP。\n\n回到90年代的时候，很多人穿着匡威鞋，用Perl写着CGI脚本。随后出现了PHP，很多人喜欢使用它，它使得制作动态网页更为容易。\n\nPHP使用的模型相当简单。虽然有一些变化，但基本上PHP服务器看起来像：\n\nHTTP请求来自用户的浏览器，并且访问了你的Apache网站服务器。Apache为每个请求创建一个单独的进程，通过一些优化来重用它们，以便最大程度地减少其需要执行的次数（创建进程相对来说较慢）。Apache调用PHP并告诉它在磁盘上运行相应的php文件。PHP代码执行并做一些阻塞的I/O调用。若在PHP中调用了`file_get_contents()`，那在背后它会触发`read()`系统调用并等待结果返回。\n\n当然，实际的代码只是简单地嵌在你的页面中，并且操作是阻塞的：\n\n```\n<?php\n\n// 阻塞的文件I/O\n$file_data = file_get_contents(\'/path/to/file.dat\');\n\n// 阻塞的网络I/O\n$curl = curl_init(\'http://example.com/example-microservice\');\n$result = curl_exec($curl);\n\n// 更多阻塞的网络I/O\n$result = $db->query(\'SELECT id, data FROM examples ORDER BY id DESC limit 100\');\n\n?>\n```\n\n\n关于它如何与系统集成，就像这样：\n\n![](https://www.shen100.com/upload/img/2017/08/23/3ec46030-5b74-48bb-b515-52d8f28a4db4.jpg)\n\n相当简单：一个请求，一个进程。I/O是阻塞的。优点是什么呢？简单，可行。那缺点是什么呢？同时与20,000个客户端连接，你的服务器就挂了。由于内核提供的用于处理大容量I/O（epoll等）的工具没有被使用，所以这种方法不能很好地扩展。更糟糕的是，为每个请求运行一个单独的进程往往会使用大量的系统资源，尤其是内存，这通常是在这样的场景中遇到的第一件事情。\n\n注意：Ruby使用的方法与PHP非常相似，在广泛而普遍的方式下，我们可以将其视为是相同的。\n\n## 多线程的方式：Java\n所以就在你买了你的第一个域名的时候，Java来了，并且在一个句子之后随便说一句“dot com”是很酷的。而Java具有语言内置的多线程（特别是在创建时），这一点非常棒。\n\n大多数Java网站服务器通过为每个进来的请求启动一个新的执行线程，然后在该线程中最终调用作为应用程序开发人员的你所编写的函数。\n\n在Java的Servlet中执行I/O操作，往往看起来像是这样：\n\n```\npublic void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException\n{\n\n    // 阻塞的文件I/O\n    InputStream fileIs = new FileInputStream(\"/path/to/file\");\n\n    // 阻塞的网络I/O\n    URLConnection urlConnection = (new URL(\"http://example.com/example-microservice\")).openConnection();\n    InputStream netIs = urlConnection.getInputStream();\n\n    // 更多阻塞的网络I/O\n    out.println(\"...\");\n}\n```\n\n\n由于我们上面的`doGet`方法对应于一个请求并且在自己的线程中运行，而不是每次请求都对应需要有自己专属内存的单独进程，所以我们会有一个单独的线程。这样会有一些不错的优点，例如可以在线程之间共享状态、共享缓存的数据等，因为它们可以相互访问各自的内存，但是它如何与调度进行交互的影响，仍然与前面PHP例子中所做的内容几乎一模一样。每个请求都会产生一个新的线程，而在这个线程中的各种I/O操作会一直阻塞，直到这个请求被完全处理为止。为了最小化创建和销毁它们的成本，线程会被汇集在一起，但是依然，有成千上万个连接就意味着成千上万个线程，这对于调度器是不利的。\n\n一个重要的里程碑是，在Java 1.4 版本（和再次显著升级的1.7 版本）中，获得了执行非阻塞I/O调用的能力。大多数应用程序，网站和其他程序，并没有使用它，但至少它是可获得的。一些Java网站服务器尝试以各种方式利用这一点; 然而，绝大多数已经部署的Java应用程序仍然如上所述那样工作。\n\n![](https://www.shen100.com/upload/img/2017/08/23/3e2fcee7-705a-4c7a-8cd5-014c5877bd26.jpg)\n\nJava让我们更进了一步，当然对于I/O也有一些很好的“开箱即用”的功能，但它仍然没有真正解决问题：当你有一个严重I/O绑定的应用程序正在被数千个阻塞线程狂拽着快要坠落至地面时怎么办。\n\n## 作为一等公民的非阻塞I/O：Node\n当谈到更好的I/O时，Node.js无疑是新宠。任何曾经对Node有过最简单了解的人都被告知它是“非阻塞”的，并且它能有效地处理I/O。在一般意义上，这是正确的。但魔鬼藏在细节中，当谈及性能时这个巫术的实现方式至关重要。\n\n本质上，Node实现的范式不是基本上说“在这里编写代码来处理请求”，而是转变成“在这里写代码开始处理请求”。每次你都需要做一些涉及I/O的事情，发出请求或者提供一个当完成时Node会调用的回调函数。\n\n在请求中进行I/O操作的典型Node代码，如下所示：\n\n```\nhttp.createServer(function(request, response) {  \n    fs.readFile(\'/path/to/file\', \'utf8\', function(err, data) {\n        response.end(data);\n    });\n});\n```\n\n可以看到，这里有两个回调函数。第一个会在请求开始时被调用，而第二个会在文件数据可用时被调用。\n\n这样做的基本上给了Node一个在这些回调函数之间有效地处理I/O的机会。一个更加相关的场景是在Node中进行数据库调用，但我不想再列出这个烦人的例子，因为它是完全一样的原则：启动数据库调用，并提供一个回调函数给Node，它使用非阻塞调用单独执行I/O操作，然后在你所要求的数据可用时调用回调函数。这种I/O调用队列，让Node来处理，然后获取回调函数的机制称为“事件循环”。它工作得非常好。\n\n![](https://www.shen100.com/upload/img/2017/08/23/4a3e0cc0-1060-4794-bab1-02dbdcc132ee.jpg)\n\n然而，这个模型中有一道关卡。在幕后，究其原因，更多是如何实现JavaScript V8 引擎（Chrome的JS引擎，用于Node），而不是其他任何事情。你所编写的JS代码全部都运行在一个线程中。思考一下。这意味着当使用有效的非阻塞技术执行I/O时，正在进行CPU绑定操作的JS可以在运行在单线程中，每个代码块阻塞下一个。 一个常见的例子是循环数据库记录，在输出到客户端前以某种方式处理它们。以下是一个例子，演示了它如何工作：\n\n```\nvar handler = function(request, response) {\n    connection.query(\'SELECT ...\', function (err, rows) {\n        if (err) { throw err };\n        for (var i = 0; i < rows.length; i++) {\n            // 对每一行纪录进行处理\n        }\n        response.end(...); // 输出结果\n    })\n};\n```\n\n虽然Node确实可以有效地处理I/O，但上面的例子中的for循环使用的是在你主线程中的CPU周期。这意味着，如果你有10,000个连接，该循环有可能会让你整个应用程序慢如蜗牛，具体取决于每次循环需要多长时间。每个请求必须分享在主线程中的一段时间，一次一个。\n\n这个整体概念的前提是I/O操作是最慢的部分，因此最重要是有效地处理这些操作，即使意味着串行进行其他处理。这在某些情况下是正确的，但不是全都正确。\n\n另一点是，虽然这只是一个意见，但是写一堆嵌套的回调可能会令人相当讨厌，有些人认为它使得代码明显无章可循。在Node代码的深处，看到嵌套四层、嵌套五层、甚至更多层级的嵌套并不罕见。\n\n我们再次回到了权衡。如果你主要的性能问题在于I/O，那么Node模型能很好地工作。然而，它的阿喀琉斯之踵（译者注：来自希腊神话，表示致命的弱点）是如果不小心的话，你可能会在某个函数里处理HTTP请求并放置CPU密集型代码，最后使得每个连接慢得如蜗牛。\n\n## 真正的非阻塞：Go\n在进入Go这一章节之前，我应该披露我是一名Go粉丝。我已经在许多项目中使用Go，是其生产力优势的公开支持者，并且在使用时我在工作中看到了他们。\n\n也就是说，我们来看看它是如何处理I/O的。Go语言的一个关键特性是它包含自己的调度器。并不是每个线程的执行对应于一个单一的OS线程，Go采用的是“goroutines”这一概念。Go运行时可以将一个goroutine分配给一个OS线程并使其执行，或者把它挂起而不与OS线程关联，这取决于goroutine做的是什么。来自Go的HTTP服务器的每个请求都在单独的Goroutine中处理。\n\n此调度器工作的示意图，如下所示：\n![](https://www.shen100.com/upload/img/2017/08/23/d22ed0dd-fef8-4407-8430-f9aaefe5c094.jpg)\n这是通过在Go运行时的各个点来实现的，通过将请求写入/读取/连接/等实现I/O调用，让当前的goroutine进入睡眠状态，当可采取进一步行动时用信息把goroutine重新唤醒。\n\n实际上，除了回调机制内置到I/O调用的实现中并自动与调度器交互外，Go运行时做的事情与Node做的事情并没有太多不同。它也不受必须把所有的处理程序代码都运行在同一个线程中这一限制，Go将会根据其调度器的逻辑自动将Goroutine映射到其认为合适的OS线程上。最后代码类似这样：\n\n```\nfunc ServeHTTP(w http.ResponseWriter, r *http.Request) {\n    // 这里底层的网络调用是非阻塞的\n    rows, err := db.Query(\"SELECT ...\")\n    for _, row := range rows {\n        // 处理rows\n        // 每个请求在它自己的goroutine中\n    }\n    w.Write(...) // 输出响应结果，也是非阻塞的\n}\n```\n\n正如你在上面见到的，我们的基本代码结构像是更简单的方式，并且在背后实现了非阻塞I/O。\n\n在大多数情况下，这最终是“两个世界中最好的”。非阻塞I/O用于全部重要的事情，但是你的代码看起来像是阻塞，因此往往更容易理解和维护。Go调度器和OS调度器之间的交互处理了剩下的部分。这不是完整的魔法，如果你建立的是一个大型的系统，那么花更多的时间去理解它工作原理的更多细节是值得的; 但与此同时，“开箱即用”的环境可以很好地工作和很好地进行扩展。\n\nGo可能有它的缺点，但一般来说，它处理I/O的方式不在其中。\n\n## 谎言，诅咒的谎言和基准\n对这些各种模式的上下文切换进行准确的定时是很困难的。也可以说这对你来没有太大作用。所以取而代之，我会给出一些比较这些服务器环境的HTTP服务器性能的基准。请记住，整个端对端的HTTP请求/响应路径的性能与很多因素有关，而这里我放在一起所提供的数据只是一些样本，以便可以进行基本的比较。\n\n对于这些环境中的每一个，我编写了适当的代码以随机字节读取一个64k大小的文件，运行一个SHA-256哈希N次（N在URL的查询字符串中指定，例如`.../test.php?n=100`），并以十六进制形式打印生成的散列。我选择了这个示例，是因为使用一些一致的I/O和一个受控的方式增加CPU使用率来运行相同的基准测试是一个非常简单的方式。关于环境使用，更多细节请参考[这些基准要点](https://peabody.io/post/server-env-benchmarks/)\n\n首先，来看一些低并发的例子。运行2000次迭代，并发300个请求，并且每次请求只做一次散列（N = 1），可以得到：\n![](https://www.shen100.com/upload/img/2017/08/23/b7ec5b94-598c-472b-a351-7724e3ee0251.jpg)\n\n> 时间是在全部并发请求中完成请求的平均毫秒数。越低越好。\n\n很难从一个图表就得出结论，但对于我来说，似乎与连接和计算量这些方面有关，我们看到时间更多地与语言本身的一般执行有关，因此更多在于I/O。请注意，被认为是“脚本语言”（输入随意，动态解释）的语言执行速度最慢。\n\n但是如果将N增加到1000，仍然并发300个请求，会发生什么呢 —— 相同的负载，但是hash迭代是之前的100倍（显着增加了CPU负载）：\n![](https://www.shen100.com/upload/img/2017/08/23/e3db6f22-df3c-43d1-9e9b-1ab11831cea3.jpg)\n\n> 时间是在全部并发请求中完成请求的平均毫秒数。越低越好。\n\n忽然之间，Node的性能显着下降了，因为每个请求中的CPU密集型操作都相互阻塞了。有趣的是，在这个测试中，PHP的性能要好得多（相对于其他的语言），并且打败了Java。（值得注意的是，在PHP中，SHA-256实现是用C编写的，执行路径在这个循环中花费更多的时间，因为这次我们进行了1000次哈希迭代）。\n\n现在让我们尝试5000个并发连接（并且N = 1）—— 或者接近于此。不幸的是，对于这些环境的大多数，失败率并不明显。对于这个图表，我们会关注每秒的请求总数。越高越好：\n![](https://www.shen100.com/upload/img/2017/08/23/423faf40-6a23-42cb-8af6-720fd4de7d8a.jpg)\n\n> 每秒的请求总数。越高越好。\n\n这张照片看起来截然不同。这是一个猜测，但是看起来像是对于高连接量，每次连接的开销与产生新进程有关，而与PHP + Apache相关联的额外内存似乎成为主要的因素并制约了PHP的性能。显然，Go是这里的冠军，其次是Java和Node，最后是PHP。\n\n## 结论\n综上所述，很显然，随着语言的演进，处理大量I/O的大型应用程序的解决方案也随之不断演进。\n\n为了公平起见，暂且抛开本文的描述，PHP和Java确实有可用于Web应用程序的非阻塞I/O的实现。 但是这些方法并不像上述方法那么常见，并且需要考虑使用这种方法来维护服务器的伴随的操作开销。更不用说你的代码必须以与这些环境相适应的方式进行结构化; “正常”的PHP或Java Web应用程序通常不会在这样的环境中进行重大改动。\n\n作为比较，如果只考虑影响性能和易用性的几个重要因素，可以得到：\n\n| 语言 | 线程或进程 | 非阻塞I/O | 易用性 |\n| -------- | -------- | -------- |  -------- |\n| PHP     | 进程     | 否     |      |\n| Java     | 线程     | 可用     | 需要回调     |\n| Node.js     | 线程     | 是     | 需要回调     |\n| Go     | 线程（Goroutine）     | 是     | 不需要回调     |\n\n线程通常要比进程有更高的内存效率，因为它们共享相同的内存空间，而进程则没有。结合与非阻塞I/O相关的因素，当我们向下移动列表到一般的启动时，因为它与改善I/O有关，可以看到至少与上面考虑的因素一样。如果我不得不在上面的比赛中选出一个冠军，那肯定会是Go。\n\n即便这样，在实践中，选择构建应用程序的环境与你的团队对于所述环境的熟悉程度以及可以实现的总体生产力密切相关。因此，每个团队只是一味地扎进去并开始用Node或Go开发Web应用程序和服务可能没有意义。事实上，寻找开发人员或内部团队的熟悉度通常被认为是不使用不同的语言和/或不同的环境的主要原因。也就是说，过去的十五年来，时代已经发生了巨大的变化。\n\n希望以上内容可以帮助你更清楚地了解幕后所发生的事件，并就如何处理应用程序现实世界中的可扩展性为你提供的一些想法。快乐输入，快乐输出！\n\n> 原文出处: [BRAD PEABODY](https://www.toptal.com/back-end/server-side-io-performance-node-php-java-go) &nbsp;&nbsp;&nbsp;&nbsp;译文出处: [dogstar](http://www.itran.cc/2017/05/17/server-side-io-performance-node-php-java-go/)','2017-08-23 11:34:22','2017-08-24 23:23:27',NULL,44,44),
	(33,'股权众筹鼻祖Naval Ravikant发表36条对于区块链乃至整个世界的思考，不得不读！',91,0,1,'![](https://www.shen100.com/upload/img/2017/08/24/26d9b5e6-f0c6-4685-b258-896087317b60.jpg)\n\n当走过史前纪事、中本魔咒、以太野望、沧海横流，发展了几近半个世纪的区块链已然成为了一种社会思潮，它预示着人类社会转型、换代的新时代的到来，以分布式网络架构为技术基础的区块链让互联网时代的组织及经济发展规律悄然发生改变。\n\n区块链用技术设计取代权威控制和情感信任，以此建立一种网络结构，所有人都可以参与成为无数节点之一，进行认证、确权、交易、追溯和调整等一系列动作，它公开透明，成本低、速度快、分布广，没有权威可以篡改伪造和取缔记录。我们可以充分地想象今天的商业、艺术、司法、科技、政治乃至社会等各个领域中，这样一个建立在运算能力和技术架构上的网络文明社会基础设施将是多么不同。\n\n尽管它毫无情怀和冷冰冰地运作，但从根本上，摈弃了狂热理想的驱使、自命权威的霸道、垄断财团的曲扭、民粹阴谋的盲动，商业诈骗和情感敲诈也会随之水落石出。\n\n无论我们是否喜欢，区块链理念所驱动的全新社会正在迅速形成。\n\n作为全球股权众筹鼻祖，Naval Ravikant 投资了数百家公司，其中便包括 Twitter、Uber 等。除此之外，他还创立了一个用于天使投资人和初创企业的快速配对平台 AngelList。在不久前，Naval Ravikant 在一天的时间里发布了 36 条推文，其中所包含的，是他关于区块链对社会乃至整个世界的思考结果的精粹。\n\n1. 区块链将用市场取代网络。\n2. 人类是网络化的物种，是第一个跨越遗传边界从而掌控世界的物种。\n3. 网络为我们提供合作的机会，否则我们将孤身一人。网络分配我们合作所得的成果。\n4. 重叠的网络创造和组织我们的社会。物理的、数字化和精神上的道路共同将所有人联系在一起。\n5. 金钱是一个网络。宗教是一个网络。公司是一个网络。道路是一个网络。电力也是一个网络。\n6. 网络必须按照规则进行组织。他们要求统治者执行这些规则，用于防备骗子。\n7. 网络具有“网络效应”。新增用户可以增加所有现有用户的网络价值。\n8. 网络效应创造一个赢者通吃的胜者。领先的网络往往成为最后唯一存在的网络。\n9. 这些网络的统治者成为社会中最强大的人物。\n10. 有些网络由国王和牧师经营，他们制定货币和法律，神圣不可亵渎。规则依附于权力，并且对外界不开放。\n11. 有些网络由公司经营，比如社交网络、搜索网络、电话或有线网络。这些网络最初就是关闭的。\n12. 有些网络由精英阶层经营，比如大学网络、医疗网络、银行网络。有点开放，有点精明。\n13. 有些是由普通人经营的，比如民主网络、互联网、平民网络。开放但是不够精明而且效率很低。\n14. 专制在战争中比民主更有效率。互联网和物理公共空间被滥用和垃圾邮件超载。\n15. 20世纪创建了一种新型的网络 —— 市场网络。其特点是开放与精明。\n16. 市场的优点取决于资源。资源是金钱，一种冷冻和交易时间的形式。\n17. 市场网络是巨人。比如信贷市场、股市、商品市场、货币市场。\n18. 他们打破市场网络在有承诺的金钱工作。否则他们只是普通网络，到目前为止都应用有限。\n19. 区块链是一种新的发明，允许开放网络中的精英无需统治者和资金的情况下参与政权。\n20. 它们是基于优点的、防篡改的、开放的投票系统。\n21. 网络由有价值的人推动。\n22. 就像社会给你金钱给从而获取你在社会中想要的东西，区块链给你硬币从而得到你想要的网络。\n23. 需要注意的是，区块链使用它独有的货币进行支付，而不是传统金融市场的普通（美元）货币。\n24. 区块链使用硬币支付，但硬币只是用来追踪完成的工作。不同的区块链需要不同的工作。\n25. 比特币用于支付固定账单，Etherium支付（执行和验证）计算。\n26. 区块链将民主和互联网的开放与市场的优点相结合。\n27. 对于区块链来说，它的优点表现在多个方面，比如安全性、计算能力、预判性、注意力、带宽、功率、存储能力、分发、内容，等等。\n28. 区块链将市场模式引入到曾经无法达到的地方。\n29. 区块链基于市场的开放性和优点可以取代先之前由国王、公司、贵族和暴民经营的网络。\n30. 拥有一块没有硬币的区块链是无意义的，就像你空有市场但是手头却没钱一样，毫无意义。\n31. 拥有一个由专政、公司、精英或暴徒控制的区块链也是没有意义的。\n32. 区块链为我们提供了管理网络的新方法。可用于银行业务、投票系统、搜索、社交媒体，以及电话和电力网。\n33. 网络不需要国王、牧师、精英、公司和暴徒。它可以由任何有价值的人来管理。\n34. 基于区块链的市场网络将取代现有网络。从一件事开始慢慢扩大范围，逐渐实现完全取代。\n35. 最终，一个国家就只是一个网络（区块链网络）。\n36. 感谢中本聪，以及所有成就他的人。\n\n> 原文: Blockchain TweetStorm&nbsp;&nbsp;&nbsp;&nbsp;译者: 安翔','2017-08-23 22:40:47','2017-08-24 23:50:31',NULL,44,0),
	(34,'黑客是这样写JavaScript的',111,2,1,'![](https://www.shen100.com/upload/img/2017/08/24/2f36d04f-f209-4ded-8110-f332bce01631.jpg)\n\n> 注 XSS攻击即Cross Site Scripting，通常在网页链接地址URL中注入JS代码来达到攻击手段，很多大厂都中过招，如：Twitter，新浪微博，示例代码：`http://www.demo.cn/=<script>alert(document.cookie)</script>`其实此代码并不能在所有浏览器上执行，但仅需要一部分浏览器(如IE6)可用，即可达到攻击效果。目前很多网站都有自动过滤XSS代码的功能，此文即介绍了一些如何屏蔽XSS过滤器的手段，其实我们可以发现，大多数在前端执行的XSS过滤都是不安全的，这对于我们在防范XSS攻击时有一定的借鉴意义。\n\n我喜欢以一种意想不到的方式使用JavaScript，写出一些看起来奇怪但其实很管用的代码，这些代码常常能够执行一些出人意料功能。这听起来似 乎有些微不足道，但是基于这点发现足以总结出一些非常有用的编程技巧。下面写到的每一个小技巧都可以屏蔽掉XSS过滤器，这也是我写这些代码的初衷。然 而，学习这样的JavaScript代码可以明显加强你对语言本身的掌握，帮助你更好地处理输入，并且提高Web应用程序的安全性。\n\n下面就看看这些令人惊异的JavaScript代码吧！\n\n## 正则表达式替换可执行代码\n当用到带有replace的正则表达式时，第二个参数支持函数赋值。在Opera中，可以利用这个参量执行代码。例如，下面这个代码片段：\n\n```\n\'XSS\'.replace(/XSS/g, alert)\n```\n\n这个执行的结果将会等价于：alert(‘XSS’); 产生这种现象的原因是正则表达式的匹配项被被当成一个参数，传递到了alert函数。一般情况下，在匹配文本上你会用一个函数调用另一段代码，像这样：\n\n```\n\'somestring\'.replace(/some/, function($1) {\n    //do something with some\n})\n```\n\n\n但是，正如在第一个例子中所看到的，我们执行了一个本地alert调用，而不是用户自定义函数，并且参数由正则表达式传递到了本地调用。这是个很酷的技巧，可以屏蔽掉一些XSS过滤器。例如，先写一个字符串，再跟一个“卯点”，接着就可以调用任何你想调用的函数啦。\n\n为了看一看这个在XSS环境中是怎么使用的，想象一下：我们在字符串中有段未过滤的攻击代码，可能是JavaScript事件或者是script标签，即这个字符串中出现了一个注入。首先，我们注入一个有效的函数alert(1)，接着我们突破这个引号的限制，最后再写我们的正则表达式。\n\n```\n.replace(/.+/,eval)//\n```\n\n注意我在这里用了eval函数执行我想执行的任何代码，并且为了使攻击代码传递给eval，正则表达式必须匹配所有项。\n\n如果我把所有的代码放在一起，展示这个页的输出，这样的话就会更容易理解这个过程：\n\n页输出：\n\n```\n<script>somevariableUnfiltered=\"YOUR INPUT\"</script>\n```\n\n上面的代码在分析脚本中很常见，你上网搜索的所有字符串都被一些广告公司储存在这样的分析脚本中。你可能没有注意到这些脚本，但是如果 你观察一个 Web页面的源，你会发现这是经常出现的。另外，论坛也是一个经常会用到这些脚本的地方。“YOUR INPUT”是你所控制的字符串。如果输入没有被正确过滤时，这也将被称为基于DOM的XSS注入。(注：DOM，将 HTML 文档表达为树结构，通常指HTML结构)\n\n输入：\n\n```\nalert(1)\".replace(/.+/,eval)//\n```\n\n输出结果：\n\n```\n<script>somevariableUnfiltered=\"alert(1)\".replace(/.+/,eval)//\"</script>\n```\n\n注意这里”//”用于清除后面引用的单行注释。\n\n## Unicode 转义\n尽管在对Unicode字符转义时，用圆括号是不太可能的，但是我们可以对正在被调用的函数名进行转义。例如：\n\n```\n\\u0061\\u006c\\u0065\\u0072\\u0074(1)\n```\n\n这句代码调用了alert(1); \\u表明这是个转义字符，并且在\\u0061后面的十六进制数是“a”。\n\n另外，常规字符可以和转义字符混合或匹配使用，下面的例子就展示了这一点：\n\n```\n\\u0061lert(1)\n```\n\n你也可以将它们包含在字符串中，甚至用eval对它们求值。Unicode转义和常规的16进制或8进制转义有些不同，因为Unicode转义可以包含在一个字符串中，或者是引用函数、变量或对象中。\n\n下面的例子展示了如何使用被求值并且被分成两部分的Unicode转义。\n\n```\neval(\'\\\\u\'+\'0061\'+\'lert(1)\')\n```\n\n通过避免像命名为alert这样的常规函数，我们就可以愚弄XSS过滤器注入我们的代码。这个例子就是用来绕过PHPIDS（一个开源的IDS系 统），最终导致规则变得更健壮。如果为了分析可能运行的恶意代码，你需要在解码JavaScript时，需要考虑过滤尽可能多的编码方法。就像在这个例子中看到的，这不是个容易的工作。\n\n## JavaScript解析器引擎\nJavaScript是一个非常动态的语言。可以执行很大量的代码。这些代码第一眼看起来似乎不能执行，然而一旦理解了解析器工作的原理，你就能够逐渐理解它背后的逻辑。\n\nJavaScript在函数执行之前是不知道函数结果的，并且很明显它必须通过调用函数返回变量的类型。这点很有趣，举个例子：如果返回函数不能返回代码块的一个有效值，就会在函数执行之后出现语法错误。\n\n说的到底是什么意思呢？好吧！代码总比空谈更有说服力，看下面的例子：\n\n```\n+alert(1)--\n```\n\nalert函数执行后，返回一个未定义的量，然而已经有些太晚了，语法错误立刻就会出现，这是因为自减操作符的操作数应该是一个数字。\n\n下面是一些不会产生错误的例子：\n\n```\n+alert(1)\n1/alert(1)\nalert(1)>>>/abc/\n```\n\n你可能认为上面的例子没有什么意义，但是实际上它们深刻体现了JavaScript的工作过程。一旦你理解了这些细节，JavaScript这个大 家伙就变得清晰，了解代码的执行方式可以帮助你理解解析器是怎么工作的。我觉得这类例子在追踪语法错误，检测基于DOM的XSS攻击和检测XSS过滤器的 时候很有用。\n\n## Throw，Delete还有什么？\n你可以用想不到的方式进行删除操作，这会产生一些很古怪的语法。让我们看看将throw, delete, not和typeof操作符组合在一起会发生什么？\n\n```\nthrow delete~typeof~alert(1)\n```\n\n你可能认为这句代码不能运行，但是使用函数调用delete却是可以的，仍旧能够执行：\n\n```\ndelete alert(1)\n```\n\n这儿有一些更多的例子：\n\n```\ndelete~[a=alert]/delete a(1)\ndelete [a=alert],delete a(1)\n```\n\n第 一眼看过去，你会认为这样的代码有语法错误，但是当你仔细分析后，你觉得会有几分道理。解析器先发现一个数组内部的变量赋值，执行赋值操作后删除 数组。同样地，删除操作是在一个函数（注* [a=alert]）调用之后，因为删除操作需要在知道函数执行结果的情况下，才能删除返回的对象，即使返回的是NULL。\n\n同时，这些代码可以用来屏蔽XSS过滤器，因为它们经常会尝试着匹配有效的语法，不希望代码太晦涩。当你的应用程序进行数据验证的时候，你应该考虑这样的例子。\n\n## 声明全局对象\n在屏蔽XSS过滤器的特定实例中，攻击代码经常隐藏在一个类似英语文本中的变量中。聪明的系统如PHPIDS，可以使用语法分析去比较判断访问请求是否是恶意攻击，所以这是测试这些系统很有用的方法。\n\n仅使用全局对象或函数时，能够产生类似英文的代码块。事实上，在sla.ckers安全论坛上，我们可以玩个小游戏，用JavaScript形式产生类似英语的句子。为了了解这是怎么一回事，请看下面的例子：\n\n```\nstop, open, print && alert(1)\n```\n\n我自己杜撰了个名字，叫作Javascriptlish, 因为它可以产生一些看起来很不可思议的代码：\n\n```\njavascript : /is/^{ a : \' weird \' }[\' & wonderful \']/\" language \"\nthe_fun: [\'never \'] + stop[\'s\']\n```\n\n我们使用正则表达式/is/跟上一个操作符^，接着创造一个对象{ a : ‘weird’}(拥有a属性和赋值weird)。在我们刚刚创造的对象中，寻找’ & wonderful ‘属性，这个属性接着被一串字符分开。\n\n接下来我们用一个命名为the_fun 的标识和一个带有never的数组，用一个命名为stop的全局函数检查s… 的属性，所有这些都是正确的语法。\n\n## Getters/Setters函数\n当火狐增加 custom syntax for setters后， 屏蔽了一些不使用圆括弧的有趣XSS注入。Opera还不支持自定义语法—从安全角度来说，这是个优点，但对JavaScript黑客来说却不是个好 消息。然而Opera支持标准的defineSetter语法。这使我们能够通过赋值以达到调用函数的 目的，说起来这对屏蔽XSS过滤器来说也有些作用。\n\n```\ndefineSetter(\'x\',alert); x=1;\n```\n\n假如你不了解setters/getters，那么上面的例子就是为全局变量x创造了一个设值函数。当一个变量被设定时就会调用设值函数。第二个参数alert是函数调用赋值。这样，当x被赋值成1时，就会调用alert函数，并把1作为参数。\n\n## Location允许url编码\nlocation对象允许url用JavaScript编码。这允许你通过双重编码进一步掩饰XSS注入。\n\n```\nlocation=\'javascript:%61%6c%65%72%74%28%31%29\'\n```\n\n将它们与转义字符结合能够很好地隐藏字符串。\n\n```\nlocation=\'javascript:%5c%75%30%30%36%31%5c%75%30%30%36%63%5c%75%30%30%36%35%5c%75%30%30%37%32%5c%75%30%30%37%34(1)\'\n```\n\n第一个例子是可行的，因为Opera的地址栏可以识别编码的地址串。通过用URL编码，你可以隐藏JavaScript代码。这点很有用，特别是当传递XSS攻击代码的时候，我们为了更进一步地屏蔽过滤，可以进行双重URL编码。\n\n第二个例子结合了第一个例子利用转义字符的技巧。所以，当你对字符串解码时，就会导致alert函数以这样的形式显示：\n\n```\n\\u0061\\u006c\\u0065\\u0072\\u0074\n```\n\n注* a 的ASCII编码为0x61\n\n> 原文: [garethheyes](https://dev.opera.com/authors/garethheyes)&nbsp;&nbsp;&nbsp;&nbsp;译者: Tianyi_Ting&nbsp;&nbsp;&nbsp;&nbsp;校核：myownghost','2017-08-24 11:06:48','2017-08-24 23:50:48',NULL,44,44);

/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `slug` varchar(200) NOT NULL DEFAULT '',
  `sequence` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;

INSERT INTO `categories` (`id`, `name`, `slug`, `sequence`, `parent_id`, `status`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	(12,'分享','',0,0,1,'2017-08-23 11:32:19','2017-08-24 21:36:28',NULL),
	(13,'提问','',0,0,1,'2017-08-23 11:32:41','2017-08-23 11:32:41',NULL),
	(14,'招聘','',0,0,1,'2017-08-23 11:32:47','2017-08-23 11:32:47',NULL),
	(15,'头条','',0,0,1,'2017-08-24 10:14:52','2017-08-24 10:50:44',NULL);

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table collects
# ------------------------------------------------------------

DROP TABLE IF EXISTS `collects`;

CREATE TABLE `collects` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `article_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(10000) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `up_count` int(11) NOT NULL DEFAULT '0',
  `source_id` int(11) unsigned NOT NULL,
  `source_name` varchar(100) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;

INSERT INTO `comments` (`id`, `content`, `parent_id`, `status`, `up_count`, `source_id`, `source_name`, `user_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	(27,'a',0,1,0,32,'article',44,'2017-08-24 23:23:27','2017-08-24 23:23:27',NULL),
	(28,'b',0,1,0,34,'article',44,'2017-08-24 23:23:38','2017-08-24 23:23:38',NULL),
	(29,'aaa',0,1,0,28,'vote',44,'2017-08-24 23:33:47','2017-08-24 23:33:47',NULL),
	(30,'adfasf',0,1,0,29,'vote',44,'2017-08-24 23:33:53','2017-08-24 23:33:53',NULL),
	(31,'bb',0,1,0,29,'vote',44,'2017-08-24 23:34:06','2017-08-24 23:34:06',NULL);

/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table images
# ------------------------------------------------------------

DROP TABLE IF EXISTS `images`;

CREATE TABLE `images` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(200) NOT NULL DEFAULT '',
  `width` int(11) unsigned DEFAULT NULL,
  `height` int(11) unsigned DEFAULT NULL,
  `mime` varchar(20) NOT NULL DEFAULT '',
  `title` varchar(100) NOT NULL DEFAULT '',
  `orignal_title` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;

INSERT INTO `images` (`id`, `url`, `width`, `height`, `mime`, `title`, `orignal_title`)
VALUES
	(18,'/upload/img/2017/08/22/f4c3fdfa-f553-40bd-9a46-b299e5fa4c4d.png',0,0,'image/png','f4c3fdfa-f553-40bd-9a46-b299e5fa4c4d.png','下拉 (1).png');

/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `message`;

CREATE TABLE `message` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `from_user_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `has_read` tinyint(4) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `type` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table top_articles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `top_articles`;

CREATE TABLE `top_articles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ups
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ups`;

CREATE TABLE `ups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `target_id` int(11) unsigned NOT NULL COMMENT '文章id或评论id',
  `type` int(11) NOT NULL COMMENT '1:为文章点赞;2:为评论点赞;',
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table user_votes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_votes`;

CREATE TABLE `user_votes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `vote_id` int(11) unsigned NOT NULL,
  `vote_item_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `phone` varchar(50) DEFAULT NULL,
  `pass` varchar(100) NOT NULL DEFAULT '',
  `score` int(11) unsigned NOT NULL,
  `article_count` int(11) unsigned NOT NULL,
  `collect_count` int(11) unsigned NOT NULL,
  `signature` varchar(200) DEFAULT NULL,
  `role` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `avatar_url` varchar(500) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `email`, `phone`, `pass`, `score`, `article_count`, `collect_count`, `signature`, `role`, `status`, `avatar_url`)
VALUES
	(44,'2017-08-20 16:01:08','2017-08-24 11:06:48',NULL,'shen100','liushen_shen@163.com','','15032160687f79fd3ba6226f5fa8fdf122abf8485c',30,6,0,'',3,2,'/images/avatar/1.png');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vote_items
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vote_items`;

CREATE TABLE `vote_items` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `count` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `vote_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `vote_items` WRITE;
/*!40000 ALTER TABLE `vote_items` DISABLE KEYS */;

INSERT INTO `vote_items` (`id`, `name`, `count`, `created_at`, `updated_at`, `deleted_at`, `vote_id`)
VALUES
	(53,'a',0,'2017-08-24 23:26:49','2017-08-24 23:26:49',NULL,28),
	(54,'b',0,'2017-08-24 23:26:49','2017-08-24 23:26:49',NULL,28),
	(55,'cccc',0,'2017-08-24 23:27:07','2017-08-24 23:27:07',NULL,29),
	(56,'dddd',0,'2017-08-24 23:27:07','2017-08-24 23:27:07',NULL,29),
	(57,'asdf',0,'2017-08-24 23:40:15','2017-08-24 23:40:15',NULL,30),
	(58,'asdf',0,'2017-08-24 23:40:15','2017-08-24 23:40:15',NULL,30);

/*!40000 ALTER TABLE `vote_items` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table votes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `votes`;

CREATE TABLE `votes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `browse_count` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `end_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `last_user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;

INSERT INTO `votes` (`id`, `name`, `browse_count`, `comment_count`, `status`, `content`, `end_at`, `created_at`, `updated_at`, `deleted_at`, `user_id`, `last_user_id`)
VALUES
	(28,'adfaf',0,1,1,'adf','2017-08-25 00:00:00','2017-08-24 23:26:49','2017-08-24 23:33:47',NULL,44,44),
	(29,'bbbbmmmm',0,2,1,'afdaf','2017-08-31 00:00:00','2017-08-24 23:27:07','2017-08-24 23:34:06',NULL,44,44),
	(30,'adsfaf',0,0,1,'adsf','2017-08-31 00:00:00','2017-08-24 23:40:15','2017-08-24 23:40:15',NULL,44,0);

/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
