#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_btnLogin_clicked()
{
    objectUser = new User();
    QString username = ui->lineEditUsername->text();
    QString password = ui->lineEditPassword->text();
}

void MainWindow::mySlot()
{

}

