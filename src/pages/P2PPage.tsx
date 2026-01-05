import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import P2PHeader from '@/components/p2p/P2PHeader';
import P2PStats from '@/components/p2p/P2PStats';
import P2PTable from '@/components/p2p/P2PTable';
import { motion } from 'framer-motion';

const P2PPage: React.FC = () => {
  const { fetchP2POpportunities } = useStore();

  useEffect(() => {
    fetchP2POpportunities();
  }, [fetchP2POpportunities]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <P2PHeader />
      <P2PStats />
      <P2PTable />
    </motion.div>
  );
};

export default P2PPage;
