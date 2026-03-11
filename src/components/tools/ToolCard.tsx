import Link from 'next/link';
import {
  Braces, CheckCircle, FileCode, Lock, Unlock, Link2, Unlink, Hash,
  AlignLeft, Pipette, Image, Scaling, Clock, Key, Fingerprint, Text,
  FileText, Type, CaseSensitive, Eraser, TextCursor, Binary, Code, Shield,
  Film, Scissors, Camera, Minimize2, Crop, FileDown, FileImage, ArrowLeftRight,
  Palette, Wind, Thermometer, Ruler, Scale, Dice5, Dices, Circle, Timer, Barcode, Percent,
  Globe, Monitor, Server, ExternalLink, Terminal, Radio, Zap, Star, Frame, Music,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces,
  CheckCircle,
  FileCode,
  Lock,
  Unlock,
  Link: Link2,
  Unlink,
  Hash,
  AlignLeft,
  Pipette,
  Image,
  Scaling,
  Clock,
  Key,
  Fingerprint,
  Text,
  FileText,
  Type,
  CaseSensitive,
  Eraser,
  TextCursor,
  Binary,
  Code,
  Shield,
  Film,
  Scissors,
  Camera,
  Minimize2,
  Crop,
  FileDown,
  FileImage,
  ArrowLeftRight,
  Palette,
  Wind,
  Thermometer,
  Ruler,
  Scale,
  Dice5,
  Dices,
  Circle,
  Timer,
  Barcode,
  Percent,
  Globe,
  Monitor,
  Server,
  ExternalLink,
  Terminal,
  Radio,
  Zap,
  Star,
  Frame,
  Music,
};

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  icon: string;
}

export default function ToolCard({ name, description, slug, icon }: ToolCardProps) {
  const Icon = iconMap[icon] || Braces;

  return (
    <Link
      href={`/${slug}`}
      className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
