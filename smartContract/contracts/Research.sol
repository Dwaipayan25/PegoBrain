// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract research{
    struct Review {
        address reviewer;
        string feedback;
        uint256 score;
    }
    struct Publication {
        uint256 id;
        address researcher;
        string title;
        string description;
        string hash;
        uint256 timestamp;
        bool reviewed;
        bool rewarded;
        uint256[] reviewIds; // Array to store review IDs
        address[] contributors;
        address[] reviewers;
        uint256 totalContributions;
        uint256 score;
    }
    struct Updates {
        uint256 timestamp;
        address userAddress;
        string description;
        string data;
    }
    struct Requests {
        uint256 timestamp;
        uint256 id;
        address userAddress;
        string data;
        bool Approved;
    }

    mapping(uint256 => Publication) public publications;
    mapping(uint256 => Review) public reviews;
    mapping(uint256 => Review[]) public getReviews;
    mapping(uint256 => Updates[]) public userUpdates;
    mapping(uint256 => mapping(address => Requests[])) public requestContribution;
    //Mapping for Researchers with their publications
    mapping(address => Publication[]) public publicationsByAddress;
    mapping(uint256 => address) public isOwner;
    //Mapping of all fileHashes to their research_id
    mapping(uint256 => string[]) public filesHash;
    //Mapping of all Contributors to their research_id
    mapping(uint256 => mapping(address => bool)) public contributors;
    //message for individual address
    mapping(address => Requests[]) public messages;

    // Counter to assign unique IDs to publications and reviews
    uint256 public publicationCounter;
    uint256 public reviewCounter;

    // Event triggered when a new research publication is submitted
    event PublicationSubmitted(uint256 indexed publicationId, address indexed researcher);

    modifier onlyOwner(uint256 _id) {
        require(msg.sender == isOwner[_id], "Only the owner can perform this action");
        _;
    }

    modifier onlyOwnerOrContributor(uint256 _id) {
        require(msg.sender == isOwner[_id] || contributors[_id][msg.sender], "Only the owner or contributors can perform this action");
        _;
    }

    function addPublication(
        string memory _title,
        string memory _description,
        string memory _fileHash
    ) public {
        publicationCounter++;
        Publication memory newPublication = Publication(
            publicationCounter,
            msg.sender,
            _title,
            _description,
            _fileHash,
            block.timestamp,
            false,
            false,
            new uint256[](0),// Initialize an empty array of review IDs
            new address[](0),
            new address[](0),
            0,
            0
        );
        publications[publicationCounter] = newPublication;
        publicationsByAddress[msg.sender].push(newPublication);
        filesHash[publicationCounter].push(_fileHash);
        isOwner[publicationCounter] = msg.sender;

        emit PublicationSubmitted(publicationCounter, msg.sender);
    }


    function updatePublications(uint256 _id, string memory _fileHash,string memory _description) public onlyOwnerOrContributor(_id) {
        filesHash[_id].push(_fileHash);
                Updates memory updates = Updates(block.timestamp, msg.sender,_description, _fileHash);
        userUpdates[_id].push(updates);
    }


    function contribute(uint256 _id, string memory _description) public {
        Requests memory request = Requests(block.timestamp,_id, msg.sender, _description,false);
        requestContribution[_id][msg.sender].push(request);
        messages[publications[_id].researcher].push(request);
    }

    function allowContributor(uint256 _id, address _contributor) public onlyOwner(_id) {
        contributors[_id][_contributor] = true;
        publications[_id].contributors.push(_contributor);
         Requests memory request = Requests(block.timestamp,_id, msg.sender, "You can contribute now",true);
        messages[_contributor].push(request);
        publicationsByAddress[_contributor].push(publications[_id]);
    }

    function addReview(uint256 _id, string memory _feedback, uint256 _score) public {
        require(stakes[msg.sender]>0, "You have to stake before adding review");
        // require(publications[_id].reviewed == false, "Publication has already been reviewed");

        Review memory review = Review({
            reviewer: msg.sender,
            feedback: _feedback,
            score: _score
        });

        uint256 reviewId = reviewCounter + 1; // Generate a new review ID
        reviewCounter++;
        getReviews[_id].push(review);

        publications[_id].reviewIds.push(reviewId);
        publications[_id].reviewers.push(msg.sender);
        reviews[reviewId] = review; // Store the review in the reviews mapping
        publications[_id].reviewed = true;
        publications[_id].score += _score;
        
    }

    function getAverageScore(uint256 _id) public view returns (uint256) {
        require(publications[_id].reviewed == true, "Publication has not been reviewed yet");

        uint256[] memory reviewIds = publications[_id].reviewIds;
        uint256 totalScore = 0;

        for (uint256 i = 0; i < reviewIds.length; i++) {
            totalScore += reviews[reviewIds[i]].score;
        }
        return totalScore / reviewIds.length;
    }

    event Received(address indexed sender, uint256 amount);

    function contributeFunds(uint256 _id) external payable {
        require(msg.value > 0, "Must send a positive amount of ETH");
        // Emit an event logging the receipt of Ether
        publications[_id].totalContributions+=(msg.value-0.001 ether);
        emit Received(msg.sender, msg.value);
    }

    function distributeFunds(uint256 _id) public onlyOwner(_id) {
        uint256 totalAmountRaised= publications[_id].totalContributions;
        uint256 creatorAmount = totalAmountRaised * 60 / 100; // 70% of totalAmountRaised to the creator
        uint256 contributorAmount = totalAmountRaised * 30 / 100; // 30% amount to contributors
        uint256 reviewerAmount = totalAmountRaised * 10 / 100; // 10% to reviewers
        
        // Transfer funds to the creator
        payable(publications[_id].researcher).transfer(creatorAmount);

        // Distribute funds among contributors
        for (uint256 i = 0; i < publications[_id].contributors.length; i++) {
            address contributor = publications[_id].contributors[i];
            uint256 contributorShare = (contributorAmount) / publications[_id].contributors.length;
            payable(contributor).transfer(contributorShare);
        }

        for (uint256 i = 0; i < publications[_id].reviewers.length; i++) {
            address reviewer1 = publications[_id].reviewers[i];
            uint256 reviewerShare = (reviewerAmount) / publications[_id].reviewers.length;
            payable(reviewer1).transfer(reviewerShare);
        }

        
        // Reset the funding details
        publications[_id].totalContributions = 0;
    }

    function getPublicationsByAddress(address _owner) public view returns(Publication[] memory){
        return publicationsByAddress[_owner];
    }

    function getPublicationById(uint256 _id) public view returns(Publication memory){
        return publications[_id];
    }

    function getMessage(address _owner)public view returns(Requests[] memory){
        return messages[_owner];
    }

    function getUserUpdates(uint256 _id) public view returns(Updates[] memory){
        return userUpdates[_id];
    }

    function getReview(uint256 _id) public view returns(Review[] memory){
        return getReviews[_id];
    }

    function getHashById(uint256 _id)public view returns(string[] memory){
        return filesHash[_id];
    }

    //for participating in governanace
    mapping(address => uint256) public stakes;

    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount);

    function stake() external payable {
        require(msg.value == 0.25 ether, "You can only stake exactly 0.25 ETH");
        require(stakes[msg.sender] == 0, "You have already staked");

        stakes[msg.sender] = msg.value;

        emit Staked(msg.sender, msg.value);
    }

    function unstake() external {
        require(stakes[msg.sender] == 0.25 ether, "You haven't staked 0.25 ETH or have already unstaked");

        uint256 amountToUnstake = stakes[msg.sender];
        stakes[msg.sender] = 0; // Reset the staked amount for the user

        payable(msg.sender).transfer(amountToUnstake); // Send the ETH back to the user

        emit Unstaked(msg.sender, amountToUnstake);
    }

    function totalStaked() public view returns (uint256) {
        return address(this).balance;
    }

}