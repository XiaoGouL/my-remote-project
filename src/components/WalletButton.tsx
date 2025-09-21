import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Box } from '@mui/material';
import { Wallet } from '@mui/icons-material';
import { t } from '@lingui/macro';

const WalletButton: React.FC = () => {
  return (
    <Box>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      variant="contained"
                      startIcon={<Wallet />}
                      onClick={openConnectModal}
                      sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        '&:hover': {
                          backgroundColor: '#1565c0',
                        },
                      }}
                    >
                      {t`Connect Wallet`}
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      variant="contained"
                      onClick={openChainModal}
                      sx={{
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        '&:hover': {
                          backgroundColor: '#c62828',
                        },
                      }}
                    >
                      {t`Wrong Network`}
                    </Button>
                  );
                }

                return (
                  <Button
                    variant="contained"
                    onClick={openAccountModal}
                    sx={{
                      backgroundColor: '#2e7d32',
                      color: 'white',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        backgroundColor: '#1b5e20',
                      },
                    }}
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </Button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </Box>
  );
};

export default WalletButton;
