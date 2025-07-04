# 📚 Hokkaido Information University Lecture Cancellation Checker
(北海道情報大学 休講情報チェッカー)

This is a simple web application that automatically logs into the Hokkaido Information University (HIU) student portal, scrapes the website for information about cancelled lectures (休講), and displays it on a clean web page.

## ✨ What It Does

- Automatically logs into the HIU student portal using your credentials
- Navigates to the lecture information page
- Scrapes the page to find any new notices about cancelled classes
- Displays the results in a simple, easy-to-read list

## 🛠️ Technologies Used

- Python: The main programming language used
- Flask: A web framework for Python to create the website
- Requests: A library used to make HTTP requests and log into the portal
- Beautiful Soup: A library used to parse the HTML of the portal and find the required information
- HTML/CSS: To create the structure and style of the website

## 🚀 How to Install and Run (English)

Follow these steps carefully to get the project running on your own computer.

### Step 1: Prerequisites

Make sure you have Python installed on your computer. You can download it from python.org.

### Step 2: Clone the Repository

Open your terminal or command prompt and run this command to download the project:

```bash
git clone https://github.com/sobanbackup1/project.git
```

### Step 3: Go to the Project Folder

Navigate into the folder you just downloaded:

```bash
cd project
```

### Step 4: Install the Required Packages

This project depends on several Python libraries. Install all of them with this command:

```bash
pip install -r requirements.txt
```

### Step 5: Add Your Login Details

This is the most important step! The script needs your university username and password to log in.

Open the app.py file in a text editor. Find these lines of code (around line 11):

```python
data = {
    'username': 'YOUR_USERNAME',
    'password': 'YOUR_PASSWORD'
}
```

Replace 'YOUR_USERNAME' with your actual university username.
Replace 'YOUR_PASSWORD' with your actual university password.
Save the app.py file.

### Step 6: Run the Application!

You're all set! To start the web application, run this command in your terminal:

```bash
python app.py
```

### Step 7: View the Results

Open your web browser (like Chrome or Firefox) and go to the following address:

```
http://127.0.0.1:5000
```

You should now see the latest lecture cancellation information from the portal!

## 🚀 使い方 (日本語)

このプロジェクトをあなたのPCで動かすための手順です。

### 手順1: 必要なもの

お使いのPCにPythonがインストールされていることを確認してください。 python.org からダウンロードできます。

### 手順2: プロジェクトのダウンロード

ターミナル（コマンドプロンプト）を開き、以下のコマンドを実行してプロジェクトをダウンロードします。

```bash
git clone https://github.com/sobanbackup1/project.git
```

### 手順3: プロジェクトフォルダへの移動

ダウンロードしたフォルダに移動します。

```bash
cd project
```

### 手順4: 必要なライブラリのインストール

このプロジェクトが依存するPythonライブラリをインストールします。

```bash
pip install -r requirements.txt
```

### 手順5: ログイン情報の設定

一番重要なステップです！ スクリプトが大学のポータルサイトにログインするために、あなたの学籍番号とパスワードが必要です。

テキストエディタで app.py ファイルを開きます。11行目あたりにある、以下のコードを見つけます。

```python
data = {
    'username': 'YOUR_USERNAME',
    'password': 'YOUR_PASSWORD'
}
```

'YOUR_USERNAME' をあなたの学籍番号に書き換えます。
'YOUR_PASSWORD' をあなたのパスワードに書き換えます。
app.py ファイルを保存します。

### 手順6: アプリケーションの実行

準備完了です！ターミナルで以下のコマンドを実行して、Webアプリケーションを起動します。

```bash
python app.py
```

### 手順7: 結果の確認

Webブラウザ（ChromeやFirefoxなど）を開き、以下のアドレスにアクセスします。

```
http://127.0.0.1:5000
```

ポータルサイトからの最新の休講情報が表示されます
