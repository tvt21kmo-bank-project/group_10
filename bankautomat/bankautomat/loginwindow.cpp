#include "loginwindow.h"
#include "ui_loginwindow.h"
#include "bankwindow.h"

LoginWindow::LoginWindow(QWidget * parent): QMainWindow(parent), ui(new Ui::LoginWindow) {
    ui -> setupUi(this);
}

LoginWindow::~LoginWindow() {
    delete ui;
    ui = nullptr;
    delete objectUser;
    objectUser = nullptr;
}

void LoginWindow::on_btnLogin_clicked() {
    QJsonObject json;
    json.insert("id", ui -> lineEditUsername -> text());
    json.insert("passwd", ui -> lineEditPassword -> text());
    QJsonDocument doc (json);
    QString strJson(doc.toJson(QJsonDocument::Compact));
    qDebug() << "Sent JSON: " + strJson;
    QString db_url = "http://87.100.209.5";
    QNetworkRequest request(db_url+"/login");
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    loginManager = new QNetworkAccessManager(this);
    connect(loginManager, SIGNAL(finished(QNetworkReply*)),
            this, SLOT(loginSlot(QNetworkReply*)));
    reply = loginManager -> post(request, QJsonDocument(json).toJson());
    /*
    bool validLogin = true; //Set this true if user data is valid during the login. SET TRUE FOR DEBUGGING PURPOSES ONLY
    bool isInt;
    int usernameGiven=ui->lineEditUsername->text().toInt(&isInt);
    int passwordGiven=ui->lineEditPassword->text().toInt(&isInt);
    if(!isInt) { //If username and/or password contain anything else than numbers, 0 is returned
        ui->labelError->setText("Älä syötä kirjaimia tai erikoismerkkejä kenttiin!");
        qDebug() << passwordGiven;
        qDebug() << usernameGiven;
    } else {
        objectUser = new User();
        objectUser->setUsername(ui->lineEditUsername->text());
        objectUser->setPassword(ui->lineEditPassword->text());
        ui->labelError->setText("");
        qDebug() << passwordGiven;
        qDebug() << usernameGiven;
       if(validLogin) {
                BankWindow *bankWindow = new BankWindow;
                bankWindow->show();
                this->close();
       } else {
           ui->labelError->setText("Sisäänkirjautuminen ei onnistunut, yritä uudelleen.");
       }
    }*/
}

void LoginWindow::loginSlot(QNetworkReply *reply) {
    QByteArray response_data = reply -> readAll();
    qDebug() << "Response data: " + response_data;
    if (response_data == "true") {
        qDebug() << "Valid login!";
        BankWindow * bankWindow = new BankWindow;
        bankWindow -> show();
        this -> close();
    } else {
        ui -> lineEditPassword -> setText("");
        ui -> lineEditUsername -> setText("");
        ui -> labelError -> setText("Sisäänkirjautuminen ei onnistunut.");
    }
}
