#include "bankwindow.h"
#include "ui_bankwindow.h"

BankWindow::BankWindow(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::BankWindow)
{
    ui->setupUi(this);
}

BankWindow::~BankWindow()
{
    delete ui;
}
