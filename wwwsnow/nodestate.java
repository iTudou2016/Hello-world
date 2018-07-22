  private void countFound(NodeStatus ns, TreeMap<Integer, VoteCount> vote_map, TreeMap<String, Integer> pool_count)
  {

    if (ns.getHeadSummary().getHeader().getBlockHeight() < LOOK_BACK) return;
    ChainHash prev = new ChainHash(ns.getHeadSummary().getHeader().getSnowHash());
    int blocks = 0;

    while(blocks < LOOK_BACK)
    {
      ChainHash h = prev;
      CoinbaseExtras extras = null;
      if ((!prev_map.containsKey(h)) || (!extra_map.containsKey(h)))
      {
        logger.log(Level.FINE, "Fetching block for vote: " + h);
        Block blk = shackleton.getStub().getBlock(RequestBlock.newBuilder().setBlockHash(h.getBytes()).build());

        extras = TransactionUtil.getInner(blk.getTransactions(0)).getCoinbaseExtras();

        prev = new ChainHash(blk.getHeader().getPrevBlockHash());
        prev_map.put(h, prev);
        extra_map.put(h, extras);
      }
      else
      {
        extras = extra_map.get(h);
        prev = prev_map.get(h);
      }
      
      updateVoteMap(vote_map, extras);
      String remark = HexUtil.getSafeString(extras.getRemarks());
      if (!pool_count.containsKey(remark))
      {
        pool_count.put(remark, 0);
      }
      pool_count.put(remark, pool_count.get(remark) + 1);


      blocks++;
    }

  }
