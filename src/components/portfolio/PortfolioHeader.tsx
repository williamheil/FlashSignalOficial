import { Plus, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { translations } from '@/utils/i18n';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PortfolioTrade } from '@/types';

interface PortfolioHeaderProps {
  onAddTrade: () => void;
  trades: PortfolioTrade[];
}

export default function PortfolioHeader({ onAddTrade, trades }: PortfolioHeaderProps) {
  const { language } = useStore();
  const t = translations[language].portfolio;

  const exportCSV = () => {
    if (trades.length === 0) return;
    
    const headers = ['Date', 'Symbol', 'Type', 'Entry Price', 'Exit Price', 'Quantity', 'Result ($)', 'Result (%)', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...trades.map(trade => {
        const result = trade.exitPrice ? (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.type === 'Long' ? 1 : -1) : 0;
        const resultPct = trade.exitPrice ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 * (trade.type === 'Long' ? 1 : -1) : 0;
        
        return [
          new Date(trade.date).toISOString(),
          trade.symbol,
          trade.type,
          trade.entryPrice,
          trade.exitPrice || '',
          trade.quantity,
          result.toFixed(2),
          resultPct.toFixed(2),
          `"${trade.notes || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `portfolio_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (trades.length === 0) return;

    const doc = new jsPDF();
    
    // Add Logo Text
    doc.setFontSize(20);
    doc.setTextColor(41, 98, 255); // #2962FF
    doc.text('Flash Signal', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Portfolio Report', 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

    const tableColumn = ["Date", "Symbol", "Type", "Entry", "Exit", "Qty", "Result ($)", "Result (%)"];
    const tableRows = trades.map(trade => {
      const result = trade.exitPrice ? (trade.exitPrice - trade.entryPrice) * trade.quantity * (trade.type === 'Long' ? 1 : -1) : 0;
      const resultPct = trade.exitPrice ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 * (trade.type === 'Long' ? 1 : -1) : 0;

      return [
        new Date(trade.date).toLocaleDateString(),
        trade.symbol,
        trade.type,
        `$${trade.entryPrice.toFixed(2)}`,
        trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-',
        trade.quantity,
        `$${result.toFixed(2)}`,
        `${resultPct.toFixed(2)}%`
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 98, 255] }
    });

    doc.save(`portfolio_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">{t.title}</h1>
        <p className="text-text-secondary">{t.subtitle}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <Button variant="outline" size="sm" onClick={exportCSV} disabled={trades.length === 0} className="hidden sm:flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t.exportCSV}
          </Button>
          <Button variant="outline" size="sm" onClick={exportPDF} disabled={trades.length === 0} className="hidden sm:flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t.exportPDF}
          </Button>
        </div>
        
        <Button onClick={onAddTrade} className="flex items-center gap-2 bg-trading-blue hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          {t.addTrade}
        </Button>
      </div>
    </div>
  );
}
