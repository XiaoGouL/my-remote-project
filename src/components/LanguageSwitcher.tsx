import React, { useState } from 'react'
import { Button, Box, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { Language, Check } from '@mui/icons-material'
import { loadLocale } from '../i18n'

interface LanguageSwitcherProps {
  onSwicth?: () => void; // 声明可选的 onChange 回调
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onSwicth }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentLocale, setCurrentLocale] = useState(
    localStorage.getItem('userLocale') || 'zh'
  )
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = async (locale: string) => {
    await loadLocale(locale)
    setCurrentLocale(locale)
    onSwicth && onSwicth()
    handleClose()
  }

  const getCurrentLanguage = () => {
    return currentLocale === 'zh' ? '中文' : 'English';
  }

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<Language />}
        onClick={handleClick}
        sx={{
          color: '#d1d4dc',
          borderColor: '#2a2a2a',
          textTransform: 'none',
          fontWeight: 600,
          px: 2,
          py: 1,
          '&:hover': {
            borderColor: '#26a69a',
            backgroundColor: 'rgba(38, 166, 154, 0.1)',
          },
        }}
      >
        {getCurrentLanguage()}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            color: '#d1d4dc',
          },
        }}
      >
        <MenuItem
          onClick={() => handleLanguageChange('en')}
          sx={{
            color: '#d1d4dc',
            '&:hover': {
              backgroundColor: 'rgba(38, 166, 154, 0.1)',
            },
          }}
        >
          <ListItemIcon>
            {currentLocale === 'en' && <Check sx={{ color: '#26a69a' }} />}
          </ListItemIcon>
          <ListItemText>English</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange('zh')}
          sx={{
            color: '#d1d4dc',
            '&:hover': {
              backgroundColor: 'rgba(38, 166, 154, 0.1)',
            },
          }}
        >
          <ListItemIcon>
            {currentLocale === 'zh' && <Check sx={{ color: '#26a69a' }} />}
          </ListItemIcon>
          <ListItemText>中文</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
