FROM trailofbits/eth-security-toolbox
RUN pip3 install echidna-parade
RUN solc-select install VERSION
RUN solc-select use VERSION
RUN printf "checkAsserts: true\ntestMode: assertion\ntestLimit: 1000000\ntimeout: 120\n" >> conf.yaml
LABEL "echidna" "gbc"

