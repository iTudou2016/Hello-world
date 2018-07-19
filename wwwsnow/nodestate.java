  private void loop()
    throws Exception
  {
    while (true)
    {
      Thread.sleep(30000);
      saveNodeState();
      }  
    }

  public synchronized void saveNodeState()
  {
    try
    {
      PrintStream out = new PrintStream(new AtomicFileOutputStream( "nodestate.json" ));
      NetworkParams params = shackleton.getParams();
      NodeStatus node_status = shackleton.getStub().getNodeStatus(QueryUtil.nr());
      BlockSummary summary = node_status.getHeadSummary();
      BlockHeader header = summary.getHeader();
      SnowFieldInfo sf = params.getSnowFieldInfo(summary.getActivatedField());
      out.println(String.format("{\n\"snowfield\": \"%s %s\",", summary.getActivatedField(), sf.getName()));
      out.println(String.format("\"blockheight\": \"%s\",", header.getBlockHeight()));

      double avg_diff = PowUtil.getDiffForTarget(BlockchainUtil.readInteger(summary.getTargetAverage()));
      double target_diff = PowUtil.getDiffForTarget(BlockchainUtil.targetBytesToBigInteger(header.getTarget()));
      double block_time_sec = summary.getBlocktimeAverageMs() / 1000.0 ;
      double estimated_hash = Math.pow(2.0, target_diff) / block_time_sec / 1e6;
      DecimalFormat df =new DecimalFormat("0.000");

      out.println(String.format("\"difficulty\": \"%s (%s)\",", df.format(target_diff), df.format(avg_diff)));
      out.println(String.format("\"networkhash\": \"%s Mh/s\"", df.format(estimated_hash)));
      out.println("\n}");
      out.flush();
      out.close();
    }
    catch(Exception e)
    {
      logger.log(Level.WARNING, "Error writing report: " + e.toString());
    }
  }
