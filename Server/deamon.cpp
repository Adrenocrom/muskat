#include "muskat.h"

QT_USE_NAMESPACE

//! [constructor]
ServerDeamon::ServerDeamon(MainWindow* mainWindow, quint16 port, bool debug, QObject *parent) :
    QObject(parent),
    m_pWebSocketServer(new QWebSocketServer(QStringLiteral("Server"),
                                            QWebSocketServer::NonSecureMode, this)),
    m_clients(),
    m_debug(debug)
{
    m_mainWindow = mainWindow;
    if (m_pWebSocketServer->listen(QHostAddress::Any, port)) {
        if (m_debug)
            qDebug() << "Server listening on port" << port;
        connect(m_pWebSocketServer, &QWebSocketServer::newConnection,
                this, &ServerDeamon::onNewConnection);
        connect(m_pWebSocketServer, &QWebSocketServer::closed, this, &ServerDeamon::closed);
    }

    m_jsonRPC = NULL;
    m_jsonRPC = new JsonRPC(m_mainWindow);
}
//! [constructor]

ServerDeamon::~ServerDeamon()
{
    m_pWebSocketServer->close();
    qDeleteAll(m_clients.begin(), m_clients.end());

    if(m_jsonRPC) {
        delete m_jsonRPC;
        m_jsonRPC = NULL;
    }
}

//! [onNewConnection]
void ServerDeamon::onNewConnection()
{
    QWebSocket *pSocket = m_pWebSocketServer->nextPendingConnection();

    connect(pSocket, &QWebSocket::textMessageReceived, this, &ServerDeamon::processTextMessage);
    connect(pSocket, &QWebSocket::binaryMessageReceived, this, &ServerDeamon::processBinaryMessage);
    connect(pSocket, &QWebSocket::disconnected, this, &ServerDeamon::socketDisconnected);

    m_clients << pSocket;

    m_mainWindow->m_qle_num_clients->setText(QString::number(m_clients.size()));
}
//! [onNewConnection]

//! [processTextMessage]
void ServerDeamon::processTextMessage(QString message)
{
    QWebSocket *pClient = qobject_cast<QWebSocket *>(sender());
    if (m_debug)
        qDebug() << "Message received:" << message;
    if(pClient) {
        m_jsonRPC->parseMessage(pClient, message);
    }
}
//! [processTextMessage]

//! [processBinaryMessage]
void ServerDeamon::processBinaryMessage(QByteArray message)
{
    QWebSocket *pClient = qobject_cast<QWebSocket *>(sender());
    if (m_debug)
        qDebug() << "Binary Message received:" << message;
    if (pClient) {
        pClient->sendBinaryMessage(message);
    }
}
//! [processBinaryMessage]

//! [socketDisconnected]
void ServerDeamon::socketDisconnected()
{
    QWebSocket *pClient = qobject_cast<QWebSocket *>(sender());
    if (m_debug)
        qDebug() << "socketDisconnected:" << pClient;
    if (pClient) {
        m_clients.removeAll(pClient);
        pClient->deleteLater();
    }

    m_mainWindow->m_qle_num_clients->setText(QString::number(m_clients.size()));
}
//! [socketDisconnected]
