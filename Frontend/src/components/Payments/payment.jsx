import React, { useState } from 'react';
import { 
  WalletIcon, 
  QrCodeIcon, 
  CreditCardIcon 
} from 'lucide-react';
import { 
  WagmiProvider, 
  useAccount, 
  useBalance, 
  useConnect, 
  useDisconnect 
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';
import { createConfig, http } from 'wagmi';
import { 
  metaMask, 
  coinbaseWallet, 
  walletConnect 
} from 'wagmi/connectors';
import QRCode from 'qr';

// Wagmi Configuration
const config = createConfig({
  chains: [mainnet],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'Medical App Payment' }),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' })
  ],
  transports: {
    [mainnet.id]: http()
  }
});

const queryClient = new QueryClient();

const PaymentGateway = () => {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [paymentAmount] = useState(550.75);
  const [showQR, setShowQR] = useState(false);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center p-2">
          <div className="w-full max-w-[1400px] h-[95vh] bg-white rounded-2xl shadow-2xl grid grid-cols-12 gap-4 p-4">
            {/* Left Payment Section */}
            <div className="col-span-4 bg-green-50 rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-green-800 flex items-center">
                  <CreditCardIcon className="mr-3 text-green-600" />
                  Payment
                </h2>
                <div className="text-green-600 font-semibold">
                  Medical App
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-green-700">Total Amount</h3>
                    <span className="text-2xl font-bold text-green-800">
                      ${paymentAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <WalletConnector 
                  selectedWallet={selectedWallet} 
                  setSelectedWallet={setSelectedWallet}
                  setShowQR={setShowQR}
                />
              </div>
            </div>

            {/* Right Transaction Section */}
            <div className="col-span-8 bg-green-100 rounded-xl p-6">
              {showQR ? (
                <QRSection paymentAmount={paymentAmount} />
              ) : (
                <TransactionSection />
              )}
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const WalletConnector = ({ selectedWallet, setSelectedWallet, setShowQR }) => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  const handleWalletConnect = (connector) => {
    connect({ connector });
    setSelectedWallet('metaMaskWallet');
    setShowQR(true);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-lg font-semibold text-green-700">Wallet Options</h4>
      
      {!isConnected ? (
        <>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleWalletConnect(connector)}
              className={`w-full p-4 rounded-xl border-2 flex justify-between items-center 
                ${selectedWallet === 'metaMaskWallet' 
                  ? 'border-green-600 bg-green-50' 
                  : 'border-transparent hover:border-green-300 bg-white'
                }`}
            >
              <div className="flex items-center">
                <WalletIcon className="mr-3 text-green-500" />
                <span className="font-semibold text-green-800">
                  {connector.name}
                </span>
              </div>
            </button>
          ))}
        </>
      ) : (
        <div className="bg-white p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <button 
              onClick={() => {
                disconnect();
                setShowQR(false);
              }}
              className="text-red-500 hover:bg-red-50 p-2 rounded"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const QRSection = ({ paymentAmount }) => {
  const { address } = useAccount();
  const [copyStatus, setCopyStatus] = useState('Copy');

  const paymentDetails = `Amount: $${paymentAmount}\nTo: Medical App\nAddress: ${address}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentDetails);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-bold text-green-800">Scan to Pay</h2>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <QRCode 
          value={paymentDetails} 
          size={300} 
          level={'H'} 
          includeMargin={true}
          fgColor="#15803d"  // Green color
        />
      </div>
      <div className="flex space-x-4">
        <button 
          onClick={handleCopy}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          {copyStatus}
        </button>
        <button 
          className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200"
          onClick={() => window.print()}
        >
          Print QR
        </button>
      </div>
    </div>
  );
};

const TransactionSection = () => {
  const transactions = [
    {
      date: '2024-03-15',
      description: 'Cardiology Consultation',
      amount: 350.50,
      currency: 'USD',
      status: 'Completed'
    },
    {
      date: '2024-03-20',
      description: 'Advanced Prescription',
      amount: 450.25,
      currency: 'USD',
      status: 'Processing'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          UI Wallet Transactions
        </h3>
        {transactions.map((transaction, index) => (
          <div 
            key={index} 
            className="bg-green-50 p-3 rounded-lg mb-2"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-green-800">
                  {transaction.description}
                </p>
                <p className="text-sm text-green-600">
                  {transaction.date}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-800">
                  {transaction.amount} {transaction.currency}
                </p>
                <p className="text-sm text-green-600">
                  {transaction.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          MetaMask Wallet Transactions
        </h3>
        <div className="bg-green-50 p-3 rounded-lg mb-2">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-green-800">
                Pending Connection
              </p>
              <p className="text-sm text-green-600">
                Connect wallet to view transactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;