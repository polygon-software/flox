

resource "aws_subnet" "web_pub_subnet" {

  count = 3

  cidr_block              = cidrsubnet(var.cidr_block, 4, count.index + var.web_pub_subnet_factor)
  map_public_ip_on_launch = true
  vpc_id                  = aws_vpc.tf_eb_vpc.id
  availability_zone = var.azs[count.index]

  tags = {
    Name = "${var.project_prefix_char}-${var.web}-pub-subnet-${var.azs[count.index]}"
    SubnetType = "public"
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_subnet" "web_pri_subnet" {

  count = 3

  cidr_block              = cidrsubnet(var.cidr_block, 4, count.index + var.web_pri_subnet_factor + var.web_pub_subnet_factor)
  map_public_ip_on_launch = false
  vpc_id                  = aws_vpc.tf_eb_vpc.id
  availability_zone = var.azs[count.index]

  tags = {
    Name = "${var.project_prefix_char}-${var.web}-pri-subnet-${var.azs[count.index]}"
    Network    = "NAT"
    SubnetType = "private"
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_route_table_association" "web_route_ass_pub" {

  count = 3

  route_table_id = aws_route_table.tf_r_table_pub.id
  subnet_id     = aws_subnet.web_pub_subnet[count.index].id


  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table_association" "web_route_ass_pri" {

  count = 3

  route_table_id = aws_route_table.tf_r_table_pri.id
  subnet_id      = aws_subnet.web_pri_subnet[count.index].id


  lifecycle {
    create_before_destroy = true
  }
}

// ----------------
