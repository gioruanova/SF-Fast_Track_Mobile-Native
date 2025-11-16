import type { LucideProps } from 'lucide-react-native';
import {
  AlertCircle, Calendar, CheckCircle, X as CloseIcon, ExternalLink, Eye, EyeOff, FileText, Home,
  LogOutIcon, Mail, MapPin, Menu, MessageCircle, MessageCirclePlus, Phone, RefreshCcw, Send, SettingsIcon, User,
} from 'lucide-react-native';
import React from 'react';

export interface IconProps extends Omit<LucideProps, 'size'> {
  size?: number;
  color?: string;
}

const createIconComponent = (IconComponent: React.ComponentType<LucideProps>, displayName: string) => {
  const WrappedIcon = ({ size = 24, color = '#000000', ...props }: IconProps) => (
    <IconComponent size={size} color={color} {...props} />
  );
  WrappedIcon.displayName = displayName;
  return WrappedIcon;
};

 const Icons = {
  Home: createIconComponent(Home, 'HomeIcon'),
  FileText: createIconComponent(FileText, 'FileTextIcon'),
  CheckCircle: createIconComponent(CheckCircle, 'CheckCircleIcon'),
  Phone: createIconComponent(Phone, 'PhoneIcon'),
  MessageCircle: createIconComponent(MessageCircle, 'MessageCircleIcon'),
  User: createIconComponent(User, 'UserIcon'),
  AlertCircle: createIconComponent(AlertCircle, 'AlertCircleIcon'),
  Mail: createIconComponent(Mail, 'MailIcon'),
  Calendar: createIconComponent(Calendar, 'CalendarIcon'),
  Close: createIconComponent(CloseIcon, 'CloseIcon'),
  Menu: createIconComponent(Menu, 'MenuIcon'),
  EyeIcon: createIconComponent(Eye, 'EyeIcon'),
  EyeOff: createIconComponent(EyeOff, 'EyeOffIcon'),
  Send: createIconComponent(Send, 'SendIcon'),
  Refresh: createIconComponent(RefreshCcw, 'RefreshIcon'),
  MapPin: createIconComponent(MapPin, 'MapPinIcon'),
  LogOutIcon: createIconComponent(LogOutIcon, 'LogOutIcon'),
  SettingsIcon: createIconComponent(SettingsIcon, 'SettingsIcon'),
  ExternalLink: createIconComponent(ExternalLink, 'ExternalLinkIcon'),
  MessageCirclePlus: createIconComponent(MessageCirclePlus, 'MessageCirclePlusIcon'),
};

export default Icons;

