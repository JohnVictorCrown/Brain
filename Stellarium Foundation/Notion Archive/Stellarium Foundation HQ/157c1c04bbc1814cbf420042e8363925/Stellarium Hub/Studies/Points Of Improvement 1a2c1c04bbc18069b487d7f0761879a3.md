# Points Of Improvement

![1000010400.jpg](Points%20Of%20Improvement%201a2c-79a3/1000010400.jpg)

***Memory System***

It needs a memory system, something like a RAG, that gets relevant information like specific actions sequence and knowledge and abilities, and also domain specific knowledge, also context specific data that is relevant to the model and adds as input to the System 1 context at 1Hz or something to this extent. This would allow the robot to: 

- Have a wide knowledge base of domain specific data without training.
- Learn by adding relevant information on the RAG or memory system.

This could be accomplished by:

- Crafting a knowledge base of domain specific data to the memory.
- Create a classifier that classifies information from all of these sources (Text command, robot state, robot images, latent vector information) and adds it to the memory or RAG if relevant.
- The classifier system could something like a parallel prompt of the vla with all the context, with the question “What information from the context might be important that I would need to remember, if any?” And then taking an action if relevant to add the data to the memory system at a slower rate like 0.1Hz.

Adding a memory system is very important not only for VLA and robotics, which is essential, but for AI models and systems too.

Something like a RAG, Large Memory Model ([https://arxiv.org/abs/2502.06049](https://arxiv.org/abs/2502.06049)), Continual Learning Memory ([https://arxiv.org/html/2502.14802v1](https://arxiv.org/html/2502.14802v1))

***Add Higher Faculty Model***

Adding something like an action to the system 2 VLA that, periodically or at a demand when it needs better information in any way, send an API request to a Higher Faculty Model with all of the context information and the Higher Faculty Model sends back relevant information and add this information to the context, it could be a series of actions from a knowledge base or context information from the robots image, it could be actual information like a llm response to a prompt, in this way the robots can be even smarter and learn domain specific information without any training. Additionally  imagine having a robot assistant or worker with all the knowledge in science and possibly the internet as AI models have nowadays.

***Others***

If helix haven't properly generalized knowledge or is not a state of the art model, consider creating a pipeline for fine-tuning and improving state of the art vla or VLM, like Pi0, a SOTA vla for robotics with specific technology for robotics, then fine tune and train for figure 2 robots and go on with it.

• The other points of improvement are self evident: Craft a synthetic data generator to tokenize whole body actions from footage, scale system 1 for whole body actions, fine tune system 1 and system 2 models on more data, etc…

• Also implement Native Sparse Attention to have helix with big context lengths, and even even better performance:

[https://arxiv.org/abs/2502.11089](https://arxiv.org/abs/2502.11089)

• Evaluate update Helix with the state of the art omni a foundational AI model, Magma from Microsoft, and do the usual fine tuning to a VLA ([https://microsoft.github.io/Magma/](https://microsoft.github.io/Magma/)) or Pi0 which is amazing ([https://www.physicalintelligence.company/blog/pi0](https://www.physicalintelligence.company/blog/pi0))

• Liquid Neural Networks for the physical intelligence is something worth studying.

What matters is having a working intelligent robot that can labor.

When the robots can perform assembly line work get the sales team to start selling these robots to companies and start mass manufacturing and build, build, build!

Congratulations, incredible job! 🎉